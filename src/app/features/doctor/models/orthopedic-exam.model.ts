export interface OrthopedicExam {
  orthopedicExamID?: number;
  applicantFileNumber: string;
  doctorID: number;
  musculoskeletal: string;
  neurologicalSurgery: string;
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
