export interface Applicant {
  applicantID: number;
  fileNumber: string;
  fullName: string;
  maritalStatusID: number;
  job: string;
  height?: number;
  weight?: number;
  bmi?: number;
  bloodPressure?: string;
  pulse?: number;
  tattoo?: boolean;
  distinctiveMarks?: string;
  maritalStatus?: MaritalStatus;
}

export interface MaritalStatus {
  maritalStatusID: number;
  description: string;
}
