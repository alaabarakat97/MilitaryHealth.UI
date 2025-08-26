import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import Swal from 'sweetalert2';
import { UserRoles } from '../models/enums/user-roles.enum';
export const authGuard: CanActivateFn = (route, state) => {

    const auth = inject(AuthService);
  const router = inject(Router);

  const roles = route.data['roles'] as UserRoles[] || [];
  const messageError = route.data['messageError'] || 'Access denied';

   if (!auth.isAuthenticated()) {
    Swal.fire({
      title: 'Not Authenticated',
      text: `${messageError}. You don’t have authentication`,
      icon: 'error',
      confirmButtonText: 'Close',
      background: '#f8d7da',
      confirmButtonColor: '#d33',
      timer: 3000,
      timerProgressBar: true
    });
    return router.createUrlTree(['/login']);
  }

  if (roles.length > 0 && !auth.isAuthorizated(roles)) {
    Swal.fire({
      title: 'Not Authorized',
      text: `${messageError}. You don’t have authorization`,
      icon: 'error',
      confirmButtonText: 'Close',
      background: '#f8d7da',
      confirmButtonColor: '#d33'
    });
    return router.createUrlTree(['/']);
  }

  return true; 
};
