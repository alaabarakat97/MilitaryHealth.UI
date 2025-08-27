import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private activeRequests = 0;

  constructor(private ngZone: NgZone) { }
  show(): void {
    this.ngZone.run(() => {
      this.activeRequests++;
      setTimeout(() => { this.updateLoadingState(),0 });
    });
  }

  hide(): void {
     this.ngZone.run(() => {
      this.activeRequests=Math.max(this.activeRequests - 1);
      setTimeout(() => { this.updateLoadingState(),0 });
    });
  }
  private updateLoadingState(): void {
    this.loadingSubject.next(this.activeRequests > 0);
  }
}
