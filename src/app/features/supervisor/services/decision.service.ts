import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../shared/models/paged-response.model';
import { FinalDecisionModel } from '../models/final-decision.model';

@Injectable({
  providedIn: 'root'
})
export class DecisionService {
  private apiUrl = `${environment.apiUrl}/api/FinalDecisions`;

  constructor(private http: HttpClient) {}
  
  createFinalDecision(decision: FinalDecisionModel): Observable<ApiResponse<FinalDecisionModel>> {
    return this.http.post<ApiResponse<FinalDecisionModel>>(this.apiUrl, decision);
  }
}
