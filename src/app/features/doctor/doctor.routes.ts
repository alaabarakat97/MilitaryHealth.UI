import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { UserRoles } from '../../core/models/enums/user-roles.enum';

export const Doctor_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/doctor-test/doctor-test').then(m => m.DoctorTest),
    canActivate: [authGuard],
    data: { roles: [UserRoles.Doctor] }
  }
];
