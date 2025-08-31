import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EyeExam } from '../models/eye-exam-post.model';

@Injectable({ providedIn: 'root' })
export class EyeExamService {
  private apiUrl = `${environment.apiUrl}/EyeExams`;

  constructor(private http: HttpClient) {}

  // جلب جميع فحوص العين
  getEyeExams(): Observable<EyeExam[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map(res => {
        const items = res.data?.items || res;
        // فقط الفحوص المؤجلة
        return items.filter((exam: any) => exam.result?.description === 'مؤجل');
      })
    );
  }

  // جلب أنواع الانكسار
  getRefractionTypes(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/RefractionTypes`);
  }

  // جلب نتائج الفحص
  getResults(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/Results`);
  }

  // إضافة فحص جديد
  addEyeExam(exam: EyeExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrl, exam, { headers });
  }

  // تحديث فحص موجود
  updateEyeExam(id: number, exam: EyeExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.put(`${this.apiUrl}/${id}`, exam, { headers });
  }
}
