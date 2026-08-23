import { resolve } from "node:path";
import {
  DEFAULT_FIXTURE_DIRECTORY,
  SCORING_IMPLEMENTATION_REVIEWED,
  runLiveEvaluation,
  validateEvaluationInventory,
} from "../evaluation/harness";

function fixtureArgument(argv: readonly string[]): string | null {
  const index = argv.indexOf("--fixtures");
  return index >= 0 && argv[index + 1] ? resolve(argv[index + 1]) : null;
}

async function main() {
  const requestedDirectory = fixtureArgument(process.argv.slice(2));
  if (process.env.RUN_LIVE_MODEL_EVAL !== "1") {
    const inventory = validateEvaluationInventory(
      requestedDirectory ?? DEFAULT_FIXTURE_DIRECTORY,
    );
    // Aggregate inventory only. No fixture text, identifiers, documents, model
    // responses, credentials, or analytics identifiers are printed.
    console.log(
      JSON.stringify({
        mode: "offline",
        networkCalls: 0,
        syntheticOnly: true,
        fixtureCount: inventory.fixtures.length,
        groundTruthCount: inventory.groundTruth.length,
        modelEligibleFixtureCount: inventory.fixtures.filter(
          (fixture) => fixture.format !== "unsupported",
        ).length,
        unsupportedInputFixtureCount: inventory.fixtures.filter(
          (fixture) => fixture.format === "unsupported",
        ).length,
        qualityGatesEvaluated: false,
        scoringImplementationReviewed: SCORING_IMPLEMENTATION_REVIEWED,
        releaseAuthorityEnabled: false,
        liveRunRequiredEnv: "RUN_LIVE_MODEL_EVAL=1",
      }),
    );
    return;
  }

  if (!requestedDirectory)
    throw new Error("Live mode requires --fixtures evaluation/fixtures.");
  const outputFile = await runLiveEvaluation(requestedDirectory);
  console.log(JSON.stringify({ mode: "live", sanitizedResultFile: outputFile }));
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Evaluation failed.";
  console.error(message);
  process.exitCode = 1;
});
