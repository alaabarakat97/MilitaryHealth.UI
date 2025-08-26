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
      path: 'dashboard',
      loadComponent: () =>
        import('./features/admin/dashboard/dashboard').then(m => m.Dashboard),
      canActivate: [authGuard],
      data: { roles: [UserRoles.Admin] }
    },
    {
  path: 'reception',
  loadComponent: () =>
    import('./features/reception/components/reception/reception').then(m => m.Reception),
  canActivate: [authGuard],
  data: { roles: [UserRoles.Reception] }
}
  ]
  },
  { path: '**', redirectTo: 'login' }
];
