import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResponse } from '../models/paged-response.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
    private apiUrl = `${environment.apiUrl}/api/Results`;
  constructor(private http: HttpClient) {}

getResults(): Observable<Result[]> {
  return this.http.get<ApiResponse<PagedResponse<Result>>>(`${this.apiUrl}?sortDesc=false&page=1&pageSize=20`)
    .pipe(
      map(response => response.data.items)
    );
}
}
