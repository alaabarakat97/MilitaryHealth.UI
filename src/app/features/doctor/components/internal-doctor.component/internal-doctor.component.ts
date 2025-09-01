import { Component } from '@angular/core';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { InternalExamForm } from './internal-exam-form/internal-exam-form';
import { CommonModule } from '@angular/common';
import { InvestigationForm } from '../Investigations/investigation-form/investigation-form';
import { ConsultationFormComponent } from '../Consultations/consultation-form.component/consultation-form.component';

@Component({
  selector: 'app-internal-doctor.component',
  imports: [CommonModule,
    SearchApplicantComponent,
    InternalExamForm,
    ConsultationFormComponent,
    InvestigationForm],
  templateUrl: './internal-doctor.component.html',
  styleUrl: './internal-doctor.component.scss'
})
export class InternalDoctorComponent {
  selectedApplicant: Applicant | null = null;

  showInternalExamForm = false;
  showConsultationForm = false;
  showInvestigationForm = false;

  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showInternalExamForm = false;
    this.showConsultationForm = false;
    this.showInvestigationForm = false;
  }

  addInternalExam() {
    if (!this.selectedApplicant) return alert('يرجى البحث عن مريض أولاً');
    this.showInternalExamForm = true;
    this.showConsultationForm = false;
    this.showInvestigationForm = false;
  }

  addConsultation() {
    if (!this.selectedApplicant) return alert('يرجى البحث عن مريض أولاً');
    this.showConsultationForm = true;
    this.showInternalExamForm = false;
    this.showInvestigationForm = false;
  }

  addInvestigation() {
    if (!this.selectedApplicant) return alert('يرجى البحث عن مريض أولاً');
    this.showInvestigationForm = true;
    this.showInternalExamForm = false;
    this.showConsultationForm = false;
  }
}