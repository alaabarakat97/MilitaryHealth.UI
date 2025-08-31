import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { UserRoles } from '../../core/models/enums/user-roles.enum';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  {
    path: 'final',
    loadComponent: () =>
      import('./final-applicant-list/final-applicant-list').then(m => m.FinalApplicantList),
    canActivate: [authGuard],
    data: { roles: [UserRoles.Admin] }
  },
];
