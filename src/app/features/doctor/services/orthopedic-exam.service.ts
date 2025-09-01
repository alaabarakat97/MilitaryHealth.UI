import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OrthopedicExam } from '../models/orthopedic-exam.model';
import { Consultation } from '../models/consultation.model';
import { Investigation } from '../models/investigation.model';
@Injectable({
  providedIn: 'root'
})
export class OrthopedicExamService {
  private apiUrl = `${environment.apiUrl}/api/OrthopedicExams`;
   private consultationUrl = `${environment.apiUrl}/api/Consultations`;
  private investigationUrl = `${environment.apiUrl}/api/Investigations`;
  public uploadUrl = `${environment.apiUrl}/api/FileUpload/upload`;
  constructor(private http: HttpClient) {}

  addOrthopedicExam(exam: OrthopedicExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrl, exam, { headers });
  }

  getResults(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.apiUrl}/api/Results`, { headers });
  }

  updateOrthopedicExam(id: number, exam: OrthopedicExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.put(`${this.apiUrl}/${id}`, exam, { headers });
  }

  // getDeferredOrthopedicExams(): Observable<OrthopedicExam[]> {
  //   const token = localStorage.getItem('token');
  //   const headers = { Authorization: `Bearer ${token}` };
  //   return this.http.get<any>(this.apiUrl, { headers }).pipe(
  //     map(res => {
  //       const items = res.data?.items || res;
  //       return items.filter((exam: any) => exam.result?.description === 'مؤجل');
  //     })
  //   );
  // }
    // 🔹 جلب كل الفحوص العظمية مع Pagination
    getAllOrthopedicExams(page = 1, pageSize = 10): Observable<{ items: OrthopedicExam[], totalCount: number }> {
      const url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
      const headers = this.getAuthHeaders();

      return this.http.get<{ data?: { items: OrthopedicExam[], totalCount: number } }>(url, { headers }).pipe(
        map(res => {
          const items = res.data?.items || [];
          const totalCount = res.data?.totalCount || items.length; // fallback إذا الـ API لا ترجع totalCount
          return { items, totalCount };
        })
      );
    }

   private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return { Authorization: `Bearer ${token}` };
  }

  // 🔹 إضافة استشارة جديدة
  addConsultation(consultation: Consultation): Observable<any> {
    return this.http.post(this.consultationUrl, consultation, {
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' }
    });
  }

  // 🔹 عرض كل الاستشارات للعيادة العظمية فقط
getOrthopedicConsultations(page = 1, pageSize = 50): Observable<Consultation[]> {
  const url = `${this.consultationUrl}?sortDesc=false&page=${page}&pageSize=${pageSize}`;
  return this.http.get<{ data?: { items: Consultation[] } }>(url, { headers: this.getAuthHeaders() }).pipe(
    map(res => (res.data?.items || []).filter((c: Consultation) => c.doctor?.specializationID === 4))
  );
}

  // 🔹 إضافة طلب تحليل
  addInvestigation(investigation: Investigation): Observable<any> {
    return this.http.post(this.investigationUrl, investigation, {
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' }
    });
  }

  // 🔹 عرض كل التحاليل للعيادة العظمية فقط
getOrthopedicInvestigations(page = 1, pageSize = 50): Observable<Investigation[]> {
  const url = `${this.investigationUrl}?sortDesc=false&page=${page}&pageSize=${pageSize}`;
  return this.http.get<{ data?: { items: Investigation[] } }>(url, { headers: this.getAuthHeaders() }).pipe(
    map(res => (res.data?.items || []).filter((i: Investigation) => i.doctor?.specializationID === 4))
  );
}
}

