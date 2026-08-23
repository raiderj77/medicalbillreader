import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { lstatSync, readFileSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BILL_ANALYSIS_SCHEMA_VERSION } from "../src/lib/bill-analysis-schema";

const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const PROFESSIONAL_REVIEW_RECORD_VERSION = "2026-08-23.1";
export const SCORING_SEMANTICS_VERSION = "2026-08-23.1";
export const PROFESSIONAL_REVIEW_SCOPE = [
  "30-case-synthetic-manifest",
  "bill-analysis-output-schema",
  "evaluation-scoring-semantics",
] as const;

export type ProfessionalReviewDecision =
  | "pending"
  | "approved"
  | "approved_with_conditions"
  | "not_approved";

export type ProfessionalReviewTargets = Readonly<{
  fixtureDefinitionsVersion: string;
  groundTruthVersion: string;
  schemaVersion: string;
  scorerVersion: string;
  fixtureDefinitionsSha256: string;
  groundTruthSha256: string;
  outputSchemaSha256: string;
  outputContractSha256: string;
  outputScrubberSha256: string;
  codeRightsConfigSha256: string;
  scoringImplementationSha256: string;
  approvalGuardSha256: string;
}>;

type NullableReviewTargets = {
  [Key in keyof ProfessionalReviewTargets]: ProfessionalReviewTargets[Key] | null;
};

export type ProfessionalReviewApprovalRecord = Readonly<{
  recordVersion: string;
  syntheticOnly: boolean;
  decision: ProfessionalReviewDecision;
  ownerAuthorization: Readonly<{
    recorded: boolean;
    date: string | null;
    scope: readonly string[];
  }>;
  reviewedCommit: string | null;
  reviewedTargets: Readonly<NullableReviewTargets>;
  reviewerChecks: Readonly<{
    identityVerifiedPrivately: boolean;
    relevantQualificationVerified: boolean;
    recentDirectBillingExperienceVerified: boolean;
    exactScopeAccepted: boolean;
    conflictDisclosureReviewed: boolean;
    independentOfImplementation: boolean;
  }>;
  writtenDecision: Readonly<{
    onFile: boolean;
    reviewDate: string | null;
    openBlockingFindings: number | null;
    allThirtyCasesAccepted: boolean;
    allSchemaDecisionsAccepted: boolean;
    allScoringDecisionsAccepted: boolean;
    allInternalFindingsDispositioned: boolean;
  }>;
  ownerAcceptedDecision: boolean;
  publicAttributionPermission: boolean;
}>;

const APPROVAL_FILE = resolve(
  PROJECT_ROOT,
  "evaluation",
  "professional-review",
  "approval.json",
);
const TARGET_FILES = Object.freeze({
  fixtureDefinitions: resolve(
    PROJECT_ROOT,
    "evaluation",
    "fixtures",
    "definitions.json",
  ),
  groundTruth: resolve(
    PROJECT_ROOT,
    "evaluation",
    "ground-truth",
    "ground-truth.json",
  ),
  outputSchema: resolve(PROJECT_ROOT, "src", "lib", "bill-analysis-schema.ts"),
  outputContract: resolve(PROJECT_ROOT, "src", "lib", "bill-analysis-output.ts"),
  outputScrubber: resolve(
    PROJECT_ROOT,
    "src",
    "lib",
    "bill-analysis-scrubber.ts",
  ),
  codeRightsConfig: resolve(PROJECT_ROOT, "src", "config", "code-set-rights.ts"),
  scoringImplementation: resolve(PROJECT_ROOT, "evaluation", "harness.ts"),
  approvalGuard: resolve(PROJECT_ROOT, "evaluation", "professional-review.ts"),
});

function canonicalText(value: string): string {
  return value.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
}

function canonicalTargetText(path: string): string {
  if (lstatSync(path).isSymbolicLink())
    throw new Error("Professional-review targets cannot be symbolic links.");
  const projectRoot = realpathSync(PROJECT_ROOT);
  const target = realpathSync(path);
  const targetRelativePath = relative(projectRoot, target);
  if (
    targetRelativePath === "" ||
    targetRelativePath.startsWith("..") ||
    isAbsolute(targetRelativePath)
  ) {
    throw new Error("Professional-review target escaped the project root.");
  }
  return canonicalText(readFileSync(target, "utf8"));
}

function sha256Text(value: string): string {
  return createHash("sha256").update(canonicalText(value), "utf8").digest("hex");
}

function sha256File(path: string): string {
  return sha256Text(canonicalTargetText(path));
}

function jsonVersion(path: string): string {
  const parsed: unknown = JSON.parse(canonicalTargetText(path));
  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    typeof (parsed as { version?: unknown }).version !== "string"
  ) {
    throw new Error(`Professional-review target ${path} has no version.`);
  }
  return (parsed as { version: string }).version;
}

export function currentProfessionalReviewTargets(): ProfessionalReviewTargets {
  return {
    fixtureDefinitionsVersion: jsonVersion(TARGET_FILES.fixtureDefinitions),
    groundTruthVersion: jsonVersion(TARGET_FILES.groundTruth),
    schemaVersion: BILL_ANALYSIS_SCHEMA_VERSION,
    scorerVersion: SCORING_SEMANTICS_VERSION,
    fixtureDefinitionsSha256: sha256File(TARGET_FILES.fixtureDefinitions),
    groundTruthSha256: sha256File(TARGET_FILES.groundTruth),
    outputSchemaSha256: sha256File(TARGET_FILES.outputSchema),
    outputContractSha256: sha256File(TARGET_FILES.outputContract),
    outputScrubberSha256: sha256File(TARGET_FILES.outputScrubber),
    codeRightsConfigSha256: sha256File(TARGET_FILES.codeRightsConfig),
    scoringImplementationSha256: sha256File(
      TARGET_FILES.scoringImplementation,
    ),
    approvalGuardSha256: sha256File(TARGET_FILES.approvalGuard),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNullableNumber(value: unknown): value is number | null {
  return (
    value === null ||
    (typeof value === "number" && Number.isInteger(value) && value >= 0)
  );
}

function isIsoDate(value: string | null): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
  );
}

function isNullableIsoDate(value: unknown): value is string | null {
  return value === null || (typeof value === "string" && isIsoDate(value));
}

function isNullableCommit(value: unknown): value is string | null {
  return (
    value === null ||
    (typeof value === "string" && /^[0-9a-f]{40}$/.test(value))
  );
}

function isNullableVersion(value: unknown): value is string | null {
  return (
    value === null ||
    (typeof value === "string" && /^\d{4}-\d{2}-\d{2}\.\d+$/.test(value))
  );
}

function isNullableSha256(value: unknown): value is string | null {
  return (
    value === null ||
    (typeof value === "string" && /^[0-9a-f]{64}$/.test(value))
  );
}

function hasExactKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
}

function isNullableReviewTargets(
  value: unknown,
): value is NullableReviewTargets {
  if (!isRecord(value)) return false;
  const keys = [
    "fixtureDefinitionsVersion",
    "groundTruthVersion",
    "schemaVersion",
    "scorerVersion",
    "fixtureDefinitionsSha256",
    "groundTruthSha256",
    "outputSchemaSha256",
    "outputContractSha256",
    "outputScrubberSha256",
    "codeRightsConfigSha256",
    "scoringImplementationSha256",
    "approvalGuardSha256",
  ];
  const versionKeys = [
    "fixtureDefinitionsVersion",
    "groundTruthVersion",
    "schemaVersion",
    "scorerVersion",
  ];
  const hashKeys = keys.filter((key) => key.endsWith("Sha256"));
  return (
    hasExactKeys(value, keys) &&
    versionKeys.every((key) => isNullableVersion(value[key])) &&
    hashKeys.every((key) => isNullableSha256(value[key]))
  );
}

function isApprovalRecord(
  value: unknown,
): value is ProfessionalReviewApprovalRecord {
  if (!isRecord(value)) return false;
  const ownerAuthorization = value.ownerAuthorization;
  const reviewerChecks = value.reviewerChecks;
  const writtenDecision = value.writtenDecision;
  return (
    hasExactKeys(value, [
      "recordVersion",
      "syntheticOnly",
      "decision",
      "ownerAuthorization",
      "reviewedCommit",
      "reviewedTargets",
      "reviewerChecks",
      "writtenDecision",
      "ownerAcceptedDecision",
      "publicAttributionPermission",
    ]) &&
    value.recordVersion === PROFESSIONAL_REVIEW_RECORD_VERSION &&
    value.syntheticOnly === true &&
    typeof value.decision === "string" &&
    ["pending", "approved", "approved_with_conditions", "not_approved"].includes(
      value.decision,
    ) &&
    isRecord(ownerAuthorization) &&
    hasExactKeys(ownerAuthorization, ["recorded", "date", "scope"]) &&
    typeof ownerAuthorization.recorded === "boolean" &&
    isNullableIsoDate(ownerAuthorization.date) &&
    Array.isArray(ownerAuthorization.scope) &&
    ownerAuthorization.scope.every((item) => typeof item === "string") &&
    exactAuthorizedScope(ownerAuthorization.scope) &&
    isNullableCommit(value.reviewedCommit) &&
    isNullableReviewTargets(value.reviewedTargets) &&
    isRecord(reviewerChecks) &&
    hasExactKeys(reviewerChecks, [
      "identityVerifiedPrivately",
      "relevantQualificationVerified",
      "recentDirectBillingExperienceVerified",
      "exactScopeAccepted",
      "conflictDisclosureReviewed",
      "independentOfImplementation",
    ]) &&
    [
      "identityVerifiedPrivately",
      "relevantQualificationVerified",
      "recentDirectBillingExperienceVerified",
      "exactScopeAccepted",
      "conflictDisclosureReviewed",
      "independentOfImplementation",
    ].every((key) => typeof reviewerChecks[key] === "boolean") &&
    isRecord(writtenDecision) &&
    hasExactKeys(writtenDecision, [
      "onFile",
      "reviewDate",
      "openBlockingFindings",
      "allThirtyCasesAccepted",
      "allSchemaDecisionsAccepted",
      "allScoringDecisionsAccepted",
      "allInternalFindingsDispositioned",
    ]) &&
    typeof writtenDecision.onFile === "boolean" &&
    isNullableIsoDate(writtenDecision.reviewDate) &&
    isNullableNumber(writtenDecision.openBlockingFindings) &&
    typeof writtenDecision.allThirtyCasesAccepted === "boolean" &&
    typeof writtenDecision.allSchemaDecisionsAccepted === "boolean" &&
    typeof writtenDecision.allScoringDecisionsAccepted === "boolean" &&
    typeof writtenDecision.allInternalFindingsDispositioned === "boolean" &&
    typeof value.ownerAcceptedDecision === "boolean" &&
    typeof value.publicAttributionPermission === "boolean"
  );
}

export function parseProfessionalReviewApproval(
  parsed: unknown,
): ProfessionalReviewApprovalRecord {
  if (!isApprovalRecord(parsed))
    throw new Error("The professional-review approval record is invalid.");
  return parsed;
}

export function readProfessionalReviewApproval(): ProfessionalReviewApprovalRecord {
  const parsed: unknown = JSON.parse(canonicalTargetText(APPROVAL_FILE));
  return parseProfessionalReviewApproval(parsed);
}

function exactAuthorizedScope(scope: readonly string[]): boolean {
  return (
    scope.length === PROFESSIONAL_REVIEW_SCOPE.length &&
    PROFESSIONAL_REVIEW_SCOPE.every((item) => scope.includes(item))
  );
}

function targetsMatch(
  reviewed: Readonly<NullableReviewTargets>,
  current: ProfessionalReviewTargets,
): boolean {
  return (Object.keys(current) as Array<keyof ProfessionalReviewTargets>).every(
    (key) => reviewed[key] === current[key],
  );
}

export function currentRepositoryCommit(): string | null {
  try {
    const commit = execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    }).trim();
    return /^[0-9a-f]{40}$/.test(commit) ? commit : null;
  } catch {
    return null;
  }
}

export function repositoryWorktreeClean(): boolean {
  try {
    return (
      execFileSync("git", ["status", "--porcelain=v1", "--untracked-files=all"], {
        cwd: PROJECT_ROOT,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        windowsHide: true,
      }).trim() === ""
    );
  } catch {
    return false;
  }
}

function gitPath(path: string): string {
  return relative(PROJECT_ROOT, path).replaceAll("\\", "/");
}

function hashAtCommit(commit: string, path: string): string | null {
  try {
    const contents = execFileSync("git", ["show", `${commit}:${gitPath(path)}`], {
      cwd: PROJECT_ROOT,
      encoding: "utf8",
      maxBuffer: 2 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
      windowsHide: true,
    });
    return sha256Text(contents);
  } catch {
    return null;
  }
}

export function reviewedCommitMatchesTargets(
  commit: string,
  targets: ProfessionalReviewTargets,
): boolean {
  if (!/^[0-9a-f]{40}$/.test(commit)) return false;
  const ancestor = spawnSync(
    "git",
    ["merge-base", "--is-ancestor", commit, "HEAD"],
    {
      cwd: PROJECT_ROOT,
      stdio: "ignore",
      windowsHide: true,
    },
  );
  if (ancestor.status !== 0) return false;
  return (
    hashAtCommit(commit, TARGET_FILES.fixtureDefinitions) ===
      targets.fixtureDefinitionsSha256 &&
    hashAtCommit(commit, TARGET_FILES.groundTruth) ===
      targets.groundTruthSha256 &&
    hashAtCommit(commit, TARGET_FILES.outputSchema) ===
      targets.outputSchemaSha256 &&
    hashAtCommit(commit, TARGET_FILES.outputContract) ===
      targets.outputContractSha256 &&
    hashAtCommit(commit, TARGET_FILES.outputScrubber) ===
      targets.outputScrubberSha256 &&
    hashAtCommit(commit, TARGET_FILES.codeRightsConfig) ===
      targets.codeRightsConfigSha256 &&
    hashAtCommit(commit, TARGET_FILES.scoringImplementation) ===
      targets.scoringImplementationSha256 &&
    hashAtCommit(commit, TARGET_FILES.approvalGuard) ===
      targets.approvalGuardSha256
  );
}

type CommitVerifier = (
  commit: string,
  targets: ProfessionalReviewTargets,
) => boolean;
type WorktreeVerifier = () => boolean;

export function professionalReviewApprovalComplete(
  record: ProfessionalReviewApprovalRecord,
  currentTargets: ProfessionalReviewTargets = currentProfessionalReviewTargets(),
  commitVerifier: CommitVerifier = reviewedCommitMatchesTargets,
  worktreeVerifier: WorktreeVerifier = repositoryWorktreeClean,
): boolean {
  const reviewedCommit = record.reviewedCommit ?? "";
  const authorizationDate = record.ownerAuthorization.date;
  const reviewDate = record.writtenDecision.reviewDate;
  return (
    record.recordVersion === PROFESSIONAL_REVIEW_RECORD_VERSION &&
    record.syntheticOnly &&
    record.decision === "approved" &&
    record.ownerAuthorization.recorded &&
    isIsoDate(authorizationDate) &&
    exactAuthorizedScope(record.ownerAuthorization.scope) &&
    /^[0-9a-f]{40}$/.test(reviewedCommit) &&
    targetsMatch(record.reviewedTargets, currentTargets) &&
    commitVerifier(reviewedCommit, currentTargets) &&
    worktreeVerifier() &&
    Object.values(record.reviewerChecks).every(Boolean) &&
    record.writtenDecision.onFile &&
    isIsoDate(reviewDate) &&
    reviewDate !== null &&
    authorizationDate !== null &&
    reviewDate >= authorizationDate &&
    record.writtenDecision.openBlockingFindings === 0 &&
    record.writtenDecision.allThirtyCasesAccepted &&
    record.writtenDecision.allSchemaDecisionsAccepted &&
    record.writtenDecision.allScoringDecisionsAccepted &&
    record.writtenDecision.allInternalFindingsDispositioned &&
    record.ownerAcceptedDecision
  );
}

export const PROFESSIONAL_REVIEW_APPROVAL = readProfessionalReviewApproval();
