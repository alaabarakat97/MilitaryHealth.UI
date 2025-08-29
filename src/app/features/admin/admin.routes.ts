import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  }
];
