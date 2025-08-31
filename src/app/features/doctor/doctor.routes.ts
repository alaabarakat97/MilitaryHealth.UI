import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';

export const Doctor_ROUTES: Routes = [
{
    path: 'eye',
    loadComponent: () =>
      import('./components/eye-doctor.component/eye-doctor.component')
        .then(m => m.EyeDoctorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'eye/deferred', 
    loadComponent: () =>
      import('./components/eye-doctor.component/deferred-eye-exams.component/deferred-eye-exams.component')
        .then(m => m.DeferredEyeExamsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'internal',
    loadComponent: () =>
      import('./components/internal-doctor.component/internal-doctor.component')
        .then(m => m.InternalDoctorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'internal/medications',
    loadComponent: () =>
      import('./components/internal-doctor.component/deferred-internal-exams.component/deferred-internal-exams.component')
        .then(m => m.DeferredInternalExamsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orthopedics',
    loadComponent: () =>
      import('./components/orthopedics-doctor.component/orthopedics-doctor.component')
        .then(m => m.OrthopedicsDoctorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orthopedics/deferred',
    loadComponent: () =>
      import('./components/orthopedics-doctor.component/deferred-orthopedi-exams-component/deferred-orthopedi-exams-component')
        .then(m => m.DeferredOrthopediExamsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'surgery',
    loadComponent: () =>
      import('./components/surgery-doctor.component/surgery-doctor.component')
        .then(m => m.SurgeryDoctorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'surgery/records',
    loadComponent: () =>
      import('./components/surgery-doctor.component/deferred-surgical-exams.component/deferred-surgical-exams.component')
        .then(m => m.DeferredSurgicalExamsComponent),
    canActivate: [authGuard]
  },
{ path: '**', loadComponent: () => import('./components/doctor-not-found-component/doctor-not-found-component').then(m => m.DoctorNotFoundComponent) }
];