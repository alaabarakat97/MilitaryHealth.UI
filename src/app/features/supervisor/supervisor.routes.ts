import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { UserRoles } from '../../core/models/enums/user-roles.enum';

export const RECEPTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/supervisor/supervisor').then(m => m.Supervisor),
    canActivate: [authGuard],
    data: { roles: [UserRoles.Supervisor] }
  }
];
