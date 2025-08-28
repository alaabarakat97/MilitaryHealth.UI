import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { UserRoles } from './core/models/enums/user-roles.enum';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },
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
        path: 'reception',
        loadChildren: () =>
          import('./features/reception/reception.routes').then(m => m.RECEPTION_ROUTES),
        data: { roles: [UserRoles.Reception] }
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
        data: { roles: [UserRoles.Supervisor] }
      },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
