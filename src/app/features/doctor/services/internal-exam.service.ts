import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InternalExam } from '../models/internal-exam.model';

@Injectable({
  providedIn: 'root'
})
export class InternalExamService {
  private apiUrl = `${environment.apiUrl}/api/InternalExams`;

  constructor(private http: HttpClient) {}

  addInternalExam(exam: InternalExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrl, exam, { headers });
  }


  getResults(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${environment.apiUrl}/Results`, { headers });
  }



  // 🔹 جلب الفحوص الداخلية المؤجلة فقط
  getDeferredInternalExams(): Observable<InternalExam[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map(res => {
        const items = res.data?.items || res;
        return items.filter((exam: any) => exam.result?.description === 'مؤجل');
      })
    );
  }

  // تحديث فحص داخلي
  updateInternalExam(id: number, exam: InternalExam): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
    return this.http.put(`${this.apiUrl}/${id}`, exam, { headers });
  }
}
