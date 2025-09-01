export interface Doctor {
  doctorID: number;
  fullName: string;
  specializationID: number;
  contractTypeID: number;
  code: string;
}

export interface Consultation {
  consultationID?: number;
  doctorID: number;
  applicantFileNumber: string;
  consultationType: string;
  referredDoctor: string;
  result: string;
  attachment?: string;
  doctor?: Doctor;
}
