import { MaritalStatus } from "./marital-status.model";

export interface ApplicantModel{
  applicantID:number;
  fileNumber:string;
  fullName: string;
  maritalStatusID: number;
  job: string;
  height: number;
  weight: number;
  bmi: number;
  bloodPressure: string;
  pulse: number;
  tattoo: boolean;
  distinctiveMarks: string;
  maritalStatus: MaritalStatus;
}
export interface ApplicantDetailsModel {
  applicantID: number;
  fileNumber: string;
  fullName: string;
  maritalStatusID: number;
  job: string;
  height: number;
  weight: number;
  bmi: number;
  bloodPressure: string;
  pulse: number;
  tattoo: boolean;
  distinctiveMarks: string;

  eyeExam?: EyeExam;
  surgicalExam?: SurgicalExam;
  orthopedicExamDto?: OrthopedicExam;
  internalExam?: InternalExam;
  consultation?: Consultation;
}

export interface EyeExam {
  eyeExamID: number;
  applicantFileNumber: string;
  doctorID: number;
  vision: string;
  colorTest: string;
  refractionTypeID: number;
  refractionValue: number;
  resultID: number;
}

export interface SurgicalExam {
  surgicalExamID: number;
  applicantFileNumber: string;
  doctorID: number;
  generalSurgery: string;
  urinarySurgery: string;
  vascularSurgery: string;
  thoracicSurgery: string;
  resultID: number;
}

export interface OrthopedicExam {
  orthopedicExamID: number;
  applicantFileNumber: string;
  doctorID: number;
  musculoskeletal: string;
  neurologicalSurgery: string;
  resultID: number;
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
}

export interface Consultation {
  consultationID: number;
  doctorID: number;
  applicantFileNumber: string;
  consultationType: string;
  referredDoctor: string;
  result: string;
  attachment: string;
}
