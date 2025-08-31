export interface SurgicalExam {
  surgicalExamID?: number; 
  applicantFileNumber: string;
  doctorID: number;
  generalSurgery: string;
  urinarySurgery: string;
  vascularSurgery: string;
  thoracicSurgery: string;
  resultID: number;
  reason?: string;

  doctor?: {
    doctorID: number;
    fullName: string;
    specializationID: number;
    contractTypeID: number;
    code: string;
  };
  result?: {
    resultID: number;
    description: string;
  };
}
