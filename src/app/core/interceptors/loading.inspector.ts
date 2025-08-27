import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly minimumDuration = 300;
  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  this.loadingService.show();
  const startTime = Date.now();

  return next.handle(request).pipe(
    finalize(() => {
      const duration = Date.now() - startTime;
      const delayDuration = Math.max(this.minimumDuration - duration, 0);

      setTimeout(() => {
        this.loadingService.hide();
      }, delayDuration);
    })
  );
}
}