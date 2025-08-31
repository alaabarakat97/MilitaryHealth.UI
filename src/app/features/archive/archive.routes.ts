import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { UserRoles } from '../../core/models/enums/user-roles.enum';

export const   Archive_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/archive-list/archive-list').then(m => m.ArchiveList),
    canActivate: [authGuard],
    data: { roles: [UserRoles.Diwan] }
  }
];
