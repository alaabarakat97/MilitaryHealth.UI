import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApplicantDetailsModel, ApplicantModel } from '../models/applicant.model';
import { ApiResponse, PagedResponse } from '../../../shared/models/paged-response.model';
import { ApplicantsStatisticsResponse } from '../models/applicants-statistics-response.model';

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
    return this.http.get<ApiResponse<ApplicantModel>>(`${this.apiUrl}/get/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
getApplicantByFileNumber$(fileNumber: string): Observable<ApplicantDetailsModel> {
  const url = this.apiUrl + "/Details";
  return this.http.get<ApiResponse<ApplicantDetailsModel>>(`${url}/${fileNumber}`)
    .pipe(
      map(response => response.data)
    );
}

  getApplicants$(
    page: number = 1,
    pageSize: number = 10,
    filter: string = ''
  ): Observable<PagedResponse<ApplicantModel>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortDesc', false);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<ApiResponse<PagedResponse<ApplicantModel>>>(this.apiUrl, { params })
      .pipe(
        map(response => response.data) 
      );
  }
  getStatistics(): Observable<ApplicantsStatisticsResponse> {
    const url = this.apiUrl + '/GetApplicantsStatistics';
    return this.http.get<ApplicantsStatisticsResponse>(url);
  }
}
