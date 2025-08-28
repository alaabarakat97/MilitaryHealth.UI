import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MaritalStatus } from '../models/marital-status.model';
import { ApiResponse, PagedResponse } from '../../../shared/models/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {
  private apiUrl = `${environment.apiUrl}/api/MaritalStatuses`;
  constructor(private http: HttpClient) {}

getMaritalStatus(): Observable<MaritalStatus[]> {
  return this.http.get<ApiResponse<PagedResponse<MaritalStatus>>>(`${this.apiUrl}?sortDesc=false&page=1&pageSize=20`)
    .pipe(
      map(response => response.data.items) // الوصول مباشرة إلى data.items
    );
}
}
