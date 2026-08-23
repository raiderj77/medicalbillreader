export const REVIEW_STATUSES = {
  WRITTEN_BY_PRODUCT_TEAM: "written_by_product_team",
  SOURCE_CHECKED: "source_checked",
  INDEPENDENTLY_REVIEWED: "independently_reviewed",
  PROFESSIONAL_REVIEW_PENDING: "professional_review_pending",
  RETIRED: "retired",
} as const;

export type ReviewStatus =
  (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];

export interface ContentReviewStatus {
  status: ReviewStatus;
  label: string;
  reviewerAttribution: null;
  lastProfessionalReviewDate: null;
}

export const ANALYZER_REVIEW_STATUS: ContentReviewStatus = {
  status: REVIEW_STATUSES.PROFESSIONAL_REVIEW_PENDING,
  label: "Professional billing review pending",
  reviewerAttribution: null,
  lastProfessionalReviewDate: null,
};

export const METHODOLOGY_REVIEW_STATUS: ContentReviewStatus = {
  ...ANALYZER_REVIEW_STATUS,
};
