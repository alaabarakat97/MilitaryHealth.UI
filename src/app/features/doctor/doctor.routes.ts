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
    path: 'eye/consultations',
    loadComponent: () =>
      import('./components/eye-doctor.component/eye-consultations/eye-consultations')
        .then(m => m.EyeConsultations),
    canActivate: [authGuard]
  },
  {
    path: 'eye/investigations',   // ← هذا الراوت الجديد
    loadComponent: () =>
      import('./components/eye-doctor.component/eye-investigations-list/eye-investigations-list')
        .then(m => m.EyeInvestigationsList),
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
    path: 'internal/consultations',
    loadComponent: () =>
      import('./components/internal-doctor.component/internal-consultations-list/internal-consultations-list')
        .then(m => m.InternalConsultationsList),
    canActivate: [authGuard]
  },
  {
    path: 'internal/investigations',
    loadComponent: () =>
      import('./components/internal-doctor.component/internal-investigations-list/internal-investigations-list')
        .then(m => m.InternalInvestigationsList),
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
  path: 'orthopedics/consultations',
  loadComponent: () =>
    import('./components/orthopedics-doctor.component/orthopedic-consultations-list/orthopedic-consultations-list')
      .then(m => m.OrthopedicConsultationsList),
  canActivate: [authGuard]
},
{
  path: 'orthopedics/investigations',
  loadComponent: () =>
    import('./components/orthopedics-doctor.component/orthopedic-investigations-list/orthopedic-investigations-list')
      .then(m => m.OrthopedicInvestigationsList),
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
  {
  path: 'surgery/consultations',
  loadComponent: () =>
    import('./components/surgery-doctor.component/surgery-consultations-list/surgery-consultations-list')
      .then(m => m.SurgeryConsultationsList),
  canActivate: [authGuard]
},
{
  path: 'surgery/investigations',
  loadComponent: () =>
    import('./components/surgery-doctor.component/surgery-investigations-list/surgery-investigations-list')
      .then(m => m.SurgeryInvestigationsList),
  canActivate: [authGuard]
},
{ path: '**', loadComponent: () => import('./components/doctor-not-found-component/doctor-not-found-component').then(m => m.DoctorNotFoundComponent) }
];