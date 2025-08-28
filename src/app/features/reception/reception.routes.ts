import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { UserRoles } from '../../core/models/enums/user-roles.enum';

export const RECEPTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/reception/reception').then(m => m.Reception),
    canActivate: [authGuard]
  },
  {
    path: 'applicants/add',
    loadComponent: () =>
      import('./components/add-edit-applicant/add-edit-applicant').then(m => m.AddEditApplicant),
    canActivate: [authGuard],
    data: { roles: [UserRoles.Reception] }
  },
    {
    path: 'applicants/:id', 
    loadComponent: () =>
      import('./components/add-edit-applicant/add-edit-applicant').then(m => m.AddEditApplicant),
    canActivate: [authGuard],
    data: { roles: [UserRoles.Reception] }
  },
];
