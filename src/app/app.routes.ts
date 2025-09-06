import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { UserRoles } from './core/models/enums/user-roles.enum';
import { Unauthorized } from './features/auth/components/unauthorized/unauthorized';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login').then(m => m.Login)
  },
   { path: 'unauthorized', component: Unauthorized },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/layout').then(m => m.Layout),
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [authGuard],
        data: { roles: [UserRoles.Admin] }
      },
      {
        path: 'applicants',
        loadComponent: () =>
          import('./features/reception/components/applicants-list/applicants-list').then(m => m.ApplicantsList),
        canActivate: [authGuard],
        data: { roles: [UserRoles.Admin] }
      },
       {
    path: 'applicants/:fileNumber',
    loadComponent: () =>
      import('./features/archive/components/applicant-profile/applicant-profile')
        .then(m => m.ApplicantProfile)
  },
      {
        path: 'reception',
        loadChildren: () =>
          import('./features/reception/reception.routes').then(m => m.RECEPTION_ROUTES),
        data: { roles: [UserRoles.Receptionist] }
      },
      {
        path: 'doctor',
        loadChildren: () =>
          import('./features/doctor/doctor.routes').then(m => m.Doctor_ROUTES),
        data: { roles: [UserRoles.Doctor] }
      },
      {
        path: 'supervisor',
        loadChildren: () =>
          import('./features/supervisor/supervisor.routes').then(m => m.RECEPTION_ROUTES),
        data: { roles: [UserRoles.Supervisor,UserRoles.Receptionist] }
      },
       {
        path: 'archive',
        loadChildren: () =>
          import('./features/archive/archive.routes').then(m => m.Archive_ROUTES),
        data: { roles: [UserRoles.Diwan] }
      },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
