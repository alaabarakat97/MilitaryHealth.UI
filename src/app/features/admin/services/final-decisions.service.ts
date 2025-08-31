import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { FinalDecisionsResponse } from '../dashboard/models/final-decisions-response.model';

@Injectable({
  providedIn: 'root'
})
export class FinalDecisionsService {
  private apiUrl = `${environment.apiUrl}/api/FinalDecisions`;

  constructor(private http: HttpClient) { }

  getFinalDecisions$(
    page: number = 1,
    pageSize: number = 10,
    filter: string = '',
    sortDesc: boolean = false
  ): Observable<FinalDecisionsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortDesc', sortDesc.toString());

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<FinalDecisionsResponse>(this.apiUrl, { params })
      .pipe(
        map(response => response)
      );
  }

  
}
