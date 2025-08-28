import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaritalStatus } from '../models/marital-status.model';

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {
  private apiUrl = `${environment.apiUrl}/api/MaritalStatuses`;
  constructor(private http: HttpClient) {}

  getMaritalStatus(): Observable<MaritalStatus[]> {
    return this.http.get<MaritalStatus[]>(`${this.apiUrl}?sortDesc=false&page=1&pageSize=20`);
  }
}
