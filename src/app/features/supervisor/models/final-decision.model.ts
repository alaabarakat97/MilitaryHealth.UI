export interface FinalDecisionModel {
  orthopedicExamID: number;
  surgicalExamID: number;
  internalExamID: number;
  eyeExamID: number;
  applicantFileNumber: string;
  resultID: number;
  reason?: string;
  postponeDuration?: string;
  decisionDate: string;
}