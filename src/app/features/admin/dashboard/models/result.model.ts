import { Result } from "../../../../shared/models/result.model";

export interface EyeExam {
  eyeExamID: number;
  applicantFileNumber: string;
  doctorID: number;
  vision: string;
  colorTest: string;
  refractionTypeID: number;
  refractionValue: number;
  resultID: number;
  result: Result;
}

export interface InternalExam {
  internalExamID: number;
  applicantFileNumber: string;
  doctorID: number;
  heart: string;
  respiratory: string;
  digestive: string;
  endocrine: string;
  neurology: string;
  blood: string;
  joints: string;
  kidney: string;
  hearing: string;
  skin: string;
  resultID: number;
  result: Result;
}

export interface OrthopedicExam {
  orthopedicExamID: number;
  applicantFileNumber: string;
  doctorID: number;
  musculoskeletal: string;
  neurologicalSurgery: string;
  resultID: number;
  result: Result;
}

export interface FinalDecision {
  decisionID: number;
  orthopedicExamID: number;
  surgicalExamID: number;
  internalExamID: number;
  eyeExamID: number;
  applicantFileNumber: string;
  resultID: number;
  reason: string;
  postponeDuration: string;
  decisionDate: string;
  eyeExam: EyeExam;
  internalExam: InternalExam;
  orthopedicExam: OrthopedicExam;
  result: Result;
}