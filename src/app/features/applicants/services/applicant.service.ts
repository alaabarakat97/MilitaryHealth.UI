import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Applicant } from '../models/applicant.model';
import { environment } from '../../../../environments/environment';
import { PagedResponse } from '../../../shared/models/paged-response.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
 private apiUrl = `${environment.apiUrl}/Applicants`;

  constructor(private http: HttpClient) {}

  getApplicantByFileNumber(fileNumber: string): Observable<Applicant> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<ApiResponse<Applicant>>(`${this.apiUrl}/${fileNumber}`, { headers })
      .pipe(map(res => res.data)); // 🔹 نعيد الـ Applicant مباشرة
  }
}