export interface Doctor {
  doctorID: number;
  specializationID: number;
  fullName?: string; // إذا كان السيرفر يرجع الاسم
}

export interface Result {
  resultID: number;
  description: string;
}

export interface InternalExam {
  internalExamID?: number;
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
  reason?: string;
  result?: Result;
  doctor?: Doctor;   // ✅ أضفنا doctor هون
}
