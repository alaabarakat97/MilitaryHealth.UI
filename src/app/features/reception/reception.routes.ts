import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { UserRoles } from '../../core/models/enums/user-roles.enum';

export const RECEPTION_ROUTES: Routes = [
  {
    path: 'applicants',
    loadComponent: () =>
      import('./components/applicants-list/applicants-list').then(m => m.ApplicantsList),
    canActivate: [authGuard],
     data: { roles: [UserRoles.Reception] }
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
  }
];
