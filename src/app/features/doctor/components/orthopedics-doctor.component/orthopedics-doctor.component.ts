import { Component } from '@angular/core';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { CommonModule } from '@angular/common';
import { OrthopedicExamFormComponent } from './orthopedic-exam-form.component/orthopedic-exam-form.component';
import { ConsultationFormComponent } from '../Consultations/consultation-form.component/consultation-form.component';
import { InvestigationForm } from '../Investigations/investigation-form/investigation-form';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orthopedics-doctor.component',
  standalone: true,
  imports: [
    SearchApplicantComponent,
    OrthopedicExamFormComponent,
    CommonModule,
    ConsultationFormComponent,
    InvestigationForm
  ],
  templateUrl: './orthopedics-doctor.component.html',
  styleUrls: ['./orthopedics-doctor.component.scss']
})
export class OrthopedicsDoctorComponent {
  selectedApplicant: Applicant | null = null;
  showExamForm = false;
  showConsultationForm = false;
  showInvestigationForm = false;

  constructor(private toastr: ToastrService) {}

  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showExamForm = false;
  }

  addOrthopedicExam() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.showExamForm = true; // فتح الفورم بعد التحقق
  }

  addConsultation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.showConsultationForm = true;
    this.showInvestigationForm = false;
  }

  addInvestigation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.showInvestigationForm = true;
    this.showConsultationForm = false;
  }
}
