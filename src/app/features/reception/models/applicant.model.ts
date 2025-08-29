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