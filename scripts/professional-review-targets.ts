import {
  PROFESSIONAL_REVIEW_APPROVAL,
  PROFESSIONAL_REVIEW_SCOPE,
  currentRepositoryCommit,
  currentProfessionalReviewTargets,
  professionalReviewApprovalComplete,
  repositoryWorktreeClean,
} from "../evaluation/professional-review";

const targets = currentProfessionalReviewTargets();
const commit = currentRepositoryCommit();
const worktreeClean = repositoryWorktreeClean();
const reviewReady = commit !== null && worktreeClean;

// This command emits only repository versions, file fingerprints, and scalar
// governance state. It must never emit reviewer identity evidence or user data.
console.log(
  JSON.stringify(
    {
      syntheticOnly: true,
      authorizedScope: PROFESSIONAL_REVIEW_SCOPE,
      authorizationRecorded:
        PROFESSIONAL_REVIEW_APPROVAL.ownerAuthorization.recorded,
      decision: PROFESSIONAL_REVIEW_APPROVAL.decision,
      approvalComplete: professionalReviewApprovalComplete(
        PROFESSIONAL_REVIEW_APPROVAL,
        targets,
      ),
      repositoryCommit: commit,
      worktreeClean,
      reviewReady,
      targets,
    },
    null,
    2,
  ),
);

if (process.argv.includes("--assert-ready") && !reviewReady) {
  throw new Error(
    "Professional-review target must be an identified commit with a clean worktree.",
  );
}
