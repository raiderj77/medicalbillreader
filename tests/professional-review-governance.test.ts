import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  PROFESSIONAL_REVIEW_APPROVAL,
  PROFESSIONAL_REVIEW_RECORD_VERSION,
  PROFESSIONAL_REVIEW_SCOPE,
  currentProfessionalReviewTargets,
  parseProfessionalReviewApproval,
  professionalReviewApprovalComplete,
  type ProfessionalReviewApprovalRecord,
} from "../evaluation/professional-review";
import {
  SCORING_IMPLEMENTATION_REVIEWED,
  validateEvaluationInventory,
} from "../evaluation/harness";
import { COMPARISON_RELEASE_GATES } from "../src/config/comparison-readiness";
import {
  ANALYZER_REVIEW_STATUS,
  REVIEW_STATUSES,
} from "../src/config/review-status";

const projectFile = (...parts: string[]) => resolve(process.cwd(), ...parts);

function approvedRecord(): ProfessionalReviewApprovalRecord {
  return {
    recordVersion: PROFESSIONAL_REVIEW_RECORD_VERSION,
    syntheticOnly: true,
    decision: "approved",
    ownerAuthorization: {
      recorded: true,
      date: "2026-08-23",
      scope: [...PROFESSIONAL_REVIEW_SCOPE],
    },
    reviewedCommit: "a".repeat(40),
    reviewedTargets: currentProfessionalReviewTargets(),
    reviewerChecks: {
      identityVerifiedPrivately: true,
      relevantQualificationVerified: true,
      recentDirectBillingExperienceVerified: true,
      exactScopeAccepted: true,
      conflictDisclosureReviewed: true,
      independentOfImplementation: true,
    },
    writtenDecision: {
      onFile: true,
      reviewDate: "2026-08-23",
      openBlockingFindings: 0,
      allThirtyCasesAccepted: true,
      allSchemaDecisionsAccepted: true,
      allScoringDecisionsAccepted: true,
      allInternalFindingsDispositioned: true,
    },
    ownerAcceptedDecision: true,
    publicAttributionPermission: false,
  };
}

function approvedRecordPasses(record: ProfessionalReviewApprovalRecord): boolean {
  return professionalReviewApprovalComplete(
    record,
    currentProfessionalReviewTargets(),
    () => true,
    () => true,
  );
}

describe("professional review governance", () => {
  it("records narrow owner authorization without claiming completed review", () => {
    expect(PROFESSIONAL_REVIEW_APPROVAL).toMatchObject({
      decision: "pending",
      ownerAuthorization: {
        recorded: true,
        date: "2026-08-23",
        scope: [...PROFESSIONAL_REVIEW_SCOPE],
      },
      reviewedCommit: null,
      ownerAcceptedDecision: false,
      publicAttributionPermission: false,
    });
    expect(
      professionalReviewApprovalComplete(PROFESSIONAL_REVIEW_APPROVAL),
    ).toBe(false);
    expect(SCORING_IMPLEMENTATION_REVIEWED).toBe(false);
    expect(ANALYZER_REVIEW_STATUS.status).toBe(
      REVIEW_STATUSES.PROFESSIONAL_REVIEW_PENDING,
    );
    expect(COMPARISON_RELEASE_GATES.professionalReviewComplete).toBe(false);
  });

  it("requires a fully approved, matching, zero-blocker record", () => {
    const approved = approvedRecord();
    const verifiedCommit = vi.fn(() => true);
    const verifiedWorktree = vi.fn(() => true);
    expect(professionalReviewApprovalComplete(approved)).toBe(false);
    expect(
      professionalReviewApprovalComplete(
        approved,
        currentProfessionalReviewTargets(),
        verifiedCommit,
        verifiedWorktree,
      ),
    ).toBe(true);
    expect(verifiedCommit).toHaveBeenCalledWith(
      approved.reviewedCommit,
      approved.reviewedTargets,
    );
    expect(verifiedWorktree).toHaveBeenCalledOnce();

    expect(
      approvedRecordPasses({
        ...approved,
        decision: "approved_with_conditions",
      }),
    ).toBe(false);
    expect(
      approvedRecordPasses({
        ...approved,
        writtenDecision: {
          ...approved.writtenDecision,
          allThirtyCasesAccepted: false,
        },
      }),
    ).toBe(false);
    expect(
      approvedRecordPasses({
        ...approved,
        reviewedTargets: {
          ...approved.reviewedTargets,
          scoringImplementationSha256: "0".repeat(64),
        },
      }),
    ).toBe(false);
    expect(
      approvedRecordPasses({
        ...approved,
        reviewerChecks: {
          ...approved.reviewerChecks,
          recentDirectBillingExperienceVerified: false,
        },
      }),
    ).toBe(false);
    expect(
      approvedRecordPasses({
        ...approved,
        writtenDecision: {
          ...approved.writtenDecision,
          openBlockingFindings: 1,
        },
      }),
    ).toBe(false);
    expect(
      approvedRecordPasses({
        ...approved,
        writtenDecision: {
          ...approved.writtenDecision,
          reviewDate: "2026-99-99",
        },
      }),
    ).toBe(false);
  });

  it("rejects unknown approval fields instead of storing identity data", () => {
    expect(() =>
      parseProfessionalReviewApproval({
        ...approvedRecord(),
        reviewerName: "must-not-be-stored",
      }),
    ).toThrow("approval record is invalid");
    expect(() =>
      parseProfessionalReviewApproval({
        ...approvedRecord(),
        reviewedTargets: {
          ...approvedRecord().reviewedTargets,
          schemaVersion: "identity@example.invalid",
        },
      }),
    ).toThrow("approval record is invalid");
  });

  it("fingerprints every authorized review target", () => {
    const targets = currentProfessionalReviewTargets();
    expect(targets).toMatchObject({
      fixtureDefinitionsVersion: "2026-08-23.1",
      groundTruthVersion: "2026-08-23.1",
      schemaVersion: "2026-08-23.1",
      scorerVersion: "2026-08-23.1",
    });
    for (const [key, value] of Object.entries(targets)) {
      if (key.endsWith("Sha256")) expect(value).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("provides a blank case-by-case scorecard for all 30 synthetic fixtures", () => {
    const inventory = validateEvaluationInventory();
    const packet = readFileSync(
      projectFile("evaluation", "professional-review", "review-packet.md"),
      "utf8",
    );
    const scorecard = readFileSync(
      projectFile("evaluation", "professional-review", "scorecard.md"),
      "utf8",
    );
    expect(inventory.fixtures).toHaveLength(30);
    for (const fixture of inventory.fixtures) {
      expect(scorecard).toContain(`| ${fixture.id} |`);
    }
    expect(packet).toContain("review not complete");
    expect(packet).toContain("Do not provide or request a real bill");
    expect(packet).toContain("analyzer prompt");
    expect(packet).toContain("only four fixtures");
    expect(packet).toContain("Any open P0 or P1 finding blocks approval");
    expect(scorecard).toMatch(/blank, non-identifying\s+template/);
  });
});
