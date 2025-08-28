import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApplicantModel } from '../models/applicant.model';
import { ApiResponse } from '../../../shared/models/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {
  private apiUrl = `${environment.apiUrl}/api/Applicants`;

  constructor(private http: HttpClient) { }

  createApplicant(applicant: ApplicantModel): Observable<ApiResponse<ApplicantModel>> {
    return this.http.post<ApiResponse<ApplicantModel>>(this.apiUrl, applicant);
  }
   updateApplicant(id: number, applicant: ApplicantModel): Observable<ApplicantModel> {
    return this.http.put<ApplicantModel>(`${this.apiUrl}/${id}`, applicant);
  }

  getApplicantById$(id: number): Observable<ApplicantModel> {
    return this.http.get<ApiResponse<ApplicantModel>>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
}
