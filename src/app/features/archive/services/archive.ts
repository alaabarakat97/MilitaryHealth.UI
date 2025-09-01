import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, map } from 'rxjs';
import { PagedResponse, ApiResponse } from '../../applicants/models/api-response.model';
import { ArchiveModel } from '../models/archive.model';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  private apiUrl = `${environment.apiUrl}/api/Archives`;

  constructor(private http: HttpClient) { }

  updateArchive(id: number, data: { digitalCopy: string }) {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

  getArchives$(
    page: number = 1,
    pageSize: number = 10,
    filter: string = ''
  ): Observable<PagedResponse<ArchiveModel>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortDesc', false);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<ApiResponse<PagedResponse<ArchiveModel>>>(this.apiUrl, { params })
      .pipe(
        map(res => res.data)
      );
  }
}
