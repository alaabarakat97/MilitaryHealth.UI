import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const payload = auth.getDecodedToken();
   if (!payload || payload.role !== 'Admin') {
    return router.createUrlTree(['/']);
  }
  return true;
};
