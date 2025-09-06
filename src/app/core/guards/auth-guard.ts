import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../features/auth/services/auth.service';
import { UserRoles } from '../models/enums/user-roles.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = route.data['roles'] as UserRoles[] || [];
  const messageError = route.data['messageError'] || 'تم رفض الوصول';

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (roles.length > 0 && !auth.isAuthorizated(roles)) {
    Swal.fire({
      title: 'غير مسموح',
      text: `${messageError}. لا تملك صلاحية للوصول إلى هذه الصفحة.`,
      icon: 'error',
      confirmButtonText: 'إغلاق',
      background: '#f8d7da',
      confirmButtonColor: '#d33'
    });
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
