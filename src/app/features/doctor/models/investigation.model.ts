export interface Doctor {
  doctorID: number;
  fullName: string;
  specializationID: number;
  contractTypeID: number;
  code: string;
}

export interface Investigation {
  investigationID?: number;
  applicantFileNumber: string;
  type: string;            // النوع الجديد
  result: string;
  attachment?: string;
  status: string;          // جديد
  doctorID: number;
  doctor?: Doctor;
}
