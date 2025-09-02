// models/eye-exam.model.ts
export interface EyeExam {
  eyeExamID?: number;

  // بيانات أساسية
  applicantFileNumber: string;   // رقم ملف المريض
  doctorID: number;              // رقم الدكتور
  vision: string;                // القدرة البصرية
  colorTest: string;             // اختبار الألوان
  refractionTypeID: number;      // نوع الانكسار
  refractionValue: number;       // قيمة الانكسار
  otherDiseases?: string;        // أمراض أخرى (اختياري) نص وليس ID
  resultID: number;              // نتيجة الفحص (ID)
  reason?: string;               // سبب الفحص (اختياري)

  doctor?: {
    doctorID: number;
    fullName: string;
    specializationID?: number;
    contractTypeID?: number;
    code?: string;
  };
  refractionType?: {
    refractionTypeID: number;
    description: string;
  };
  result?: {
    resultID: number;
    description: string;
  };
}
