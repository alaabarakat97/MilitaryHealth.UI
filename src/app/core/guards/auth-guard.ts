import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../features/auth/services/auth.service';
import { UserRoles } from '../models/enums/user-roles.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = route.data['roles'] as UserRoles[] || [];
  const messageError = route.data['messageError'] || 'Access denied';

  // ✅ تحقق من وجود توكن (المصادقة)
  if (!auth.isAuthenticated()) {
    Swal.fire({
      title: 'Not Authenticated',
      text: `${messageError}. You are not logged in.`,
      icon: 'error',
      confirmButtonText: 'Close',
      background: '#f8d7da',
      confirmButtonColor: '#d33',
      timer: 3000,
      timerProgressBar: true
    });
    return router.createUrlTree(['/login']);
  }

  // ✅ تحقق من الأدوار (التفويض)
  if (roles.length > 0 && !auth.isAuthorizated(roles)) {
    Swal.fire({
      title: 'Not Authorized',
      text: `${messageError}. You don’t have permission.`,
      icon: 'error',
      confirmButtonText: 'Close',
      background: '#f8d7da',
      confirmButtonColor: '#d33'
    });
    return router.createUrlTree(['/unauthorized']); // الأفضل توجيه لصفحة "Unauthorized" بدل "/"
  }

  return true;
};
