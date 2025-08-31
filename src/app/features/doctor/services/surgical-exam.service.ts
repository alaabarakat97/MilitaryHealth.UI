// services/surgical-exam.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SurgicalExam } from '../models/surgical-exam-post.model';

@Injectable({
  providedIn: 'root'
})
export class SurgicalExamService {
  private apiUrl = `${environment.apiUrl}/SurgicalExams`;

  constructor(private http: HttpClient) {}

  // إضافة فحص جراحي جديد
  addSurgicalExam(exam: SurgicalExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrl, exam, { headers });
  }

  // جلب جميع الفحوصات
  getSurgicalExams(): Observable<SurgicalExam[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map(res => res.data?.items || res) // fallback إذا الـ API ترجع array مباشرة
    );
  }

  // جلب الفحوصات المؤجلة فقط
  getDeferredSurgicalExams(): Observable<SurgicalExam[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map(res => {
        const items = res.data?.items || res;
        // فلترة الفحوص المؤجلة حسب النتيجة
        return items.filter((exam: any) => exam.result?.description === 'مؤجل');
      })
    );
  }

  // جلب نتائج الفحوص
  getResults(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.apiUrl}/Results`, { headers });
  }

  // تحديث فحص جراحي موجود
  updateSurgicalExam(id: number, exam: SurgicalExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.put(`${this.apiUrl}/${id}`, exam, { headers });
  }
}
