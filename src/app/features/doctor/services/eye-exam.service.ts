import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EyeExam } from '../models/eye-exam-post.model';
import { Consultation } from '../models/consultation.model'; // لازم تعمل موديل للاستشارة
import { Investigation } from '../models/investigation.model';

@Injectable({ providedIn: 'root' })
export class EyeExamService {
  private apiUrl = `${environment.apiUrl}/api/EyeExams`;
  private consultationUrl = `${environment.apiUrl}/api/Consultations`;
  private uploadUrl = `${environment.apiUrl}/api/FileUpload/upload`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  //  جلب جميع فحوص العين (المؤجلة فقط)
  getEyeExams(): Observable<EyeExam[]> {
    return this.http.get<any>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      map(res => {
        const items = res.data?.items || res;
        return items.filter((exam: any) => exam.result?.description === 'مؤجل');
      })
    );
  }

  //  جلب أنواع الانكسار
  getRefractionTypes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/RefractionTypes`, {
      headers: this.getAuthHeaders(),
    });
  }

  //  جلب نتائج الفحص
  getResults(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Results`, {
      headers: this.getAuthHeaders(),
    });
  }

  //  إضافة فحص جديد
  addEyeExam(exam: EyeExam): Observable<any> {
    return this.http.post(this.apiUrl, exam, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json'),
    });
  }

  //  تحديث فحص موجود
  updateEyeExam(id: number, exam: EyeExam): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, exam, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json'),
    });
  }

  //  رفع الملف وإرجاع المسار
uploadFile(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('File', file); // لاحظ أن المفتاح File كما في الـ API

  return this.http.post<any>(this.uploadUrl, formData, {
    headers: this.getAuthHeaders()
  }).pipe(
    map(res => res.path) // 🔹 فقط المسار
  );
}


//  جلب كل فحوصات العيادة العينية فقط مع التصفية
getAllEyeExams(page: number = 1, pageSize: number = 20): Observable<EyeExam[]> {
  const url = `${this.apiUrl}?sortDesc=false&page=${page}&pageSize=${pageSize}`;
  return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
    map(res => {
      const items: EyeExam[] = res.data?.items || [];
      // فقط فحوصات العيادة العينية (specializationID = 1)
      return items.filter(exam => exam.doctor?.specializationID === 1);
    })
  );
}


 //  إضافة استشارة جديدة
addConsultation(consultation: Consultation): Observable<any> {
  return this.http.post(this.consultationUrl, consultation, {
    headers: this.getAuthHeaders().set('Content-Type', 'application/json'),
  });
}
 // جلب جميع استشارات العيادة العينية فقط
getEyeClinicConsultations(page: number = 1, pageSize: number = 20): Observable<Consultation[]> {
  const url = `${this.consultationUrl}?sortDesc=false&page=${page}&pageSize=${pageSize}`;
  return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
    map(res => {
      const items: Consultation[] = res.data?.items || [];
      // فقط استشارات العيادة العينية (specializationID = 1)
      return items.filter(c => c.doctor?.specializationID === 1);
    })
  );
}

  // تحديث استشارة موجودة
updateConsultation(id: number, consultation: Consultation): Observable<any> {
  return this.http.put(`${this.consultationUrl}/${id}`, consultation, {
    headers: this.getAuthHeaders().set('Content-Type', 'application/json'),
  });
}


// EyeExamService
private investigationUrl = `${environment.apiUrl}/api/Investigations`;

  // جلب جميع التحاليل الخاصة بالعيادة العينية فقط
  getEyeClinicInvestigations(page: number = 1, pageSize: number = 20): Observable<Investigation[]> {
    const url = `${this.investigationUrl}?sortDesc=false&page=${page}&pageSize=${pageSize}`;
    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      map(res => {
        const items = res.data?.items || [];
        // نفترض أن العيادة العينية لها specializationID = 1
        return items.filter((inv: any) => inv.doctor?.specializationID === 1);
      })
    );
  }
// إضافة طلب تحليل جديد
addInvestigation(investigation: Investigation) {
  return this.http.post(this.investigationUrl, investigation, {
    headers: this.getAuthHeaders().set('Content-Type', 'application/json')
  });
}
// تعديل تحليل موجود
  updateInvestigation(id: number, inv: Investigation) {
    return this.http.put(`${this.investigationUrl}/${id}`, inv, {
      headers: this.getAuthHeaders().set('Content-Type', 'application/json')
    });
  }



}
