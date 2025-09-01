import { Component } from '@angular/core';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { CommonModule } from '@angular/common';
import { SurgicalExamForm } from './surgical-exam-form/surgical-exam-form';
import { InvestigationForm } from '../Investigations/investigation-form/investigation-form';
import { ConsultationFormComponent } from '../Consultations/consultation-form.component/consultation-form.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-surgery-doctor.component',
  imports: [
    SearchApplicantComponent, 
    SurgicalExamForm,
    CommonModule,
    ConsultationFormComponent,
    InvestigationForm
  ], 
  templateUrl: './surgery-doctor.component.html',
  styleUrls: ['./surgery-doctor.component.scss']
})
export class SurgeryDoctorComponent {
  selectedApplicant: Applicant | null = null;

  showExamForm = false;
  showConsultationForm = false;
  showInvestigationForm = false;

  constructor(private toastr: ToastrService) {}

  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showExamForm = false;
    this.showConsultationForm = false;
    this.showInvestigationForm = false;
  }

  addSurgicalExam() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.showExamForm = true;
    this.showConsultationForm = false;
    this.showInvestigationForm = false;
  }

  addConsultation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.showConsultationForm = true;
    this.showExamForm = false;
    this.showInvestigationForm = false;
  }

  addInvestigation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.showInvestigationForm = true;
    this.showExamForm = false;
    this.showConsultationForm = false;
  }
}
