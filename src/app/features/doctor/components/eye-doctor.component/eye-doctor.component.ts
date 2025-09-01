import { Component } from '@angular/core';
import { Applicant } from '../../../applicants/models/applicant.model';
import { EyeExamForm } from './eye-exam-form/eye-exam-form';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { CommonModule } from '@angular/common';
import { ConsultationFormComponent } from '../Consultations/consultation-form.component/consultation-form.component';
import { InvestigationForm } from '../Investigations/investigation-form/investigation-form';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eye-doctor',
  standalone: true,
  imports: [
    SearchApplicantComponent,
    InvestigationForm,
    EyeExamForm,
    CommonModule,
    ConsultationFormComponent
  ],
  templateUrl: './eye-doctor.component.html',
  styleUrls: ['./eye-doctor.component.scss']
})
export class EyeDoctorComponent {
  selectedApplicant: Applicant | null = null;
  showExamForm = false;
  showConsultationForm = false;
  showAnalysisForm = false;

  constructor(private toastr: ToastrService) {} // ✅ أضفنا toastr

  // 🔹 يلتقط المريض من SearchApplicantComponent
  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showExamForm = false;
    this.showConsultationForm = false;
    this.showAnalysisForm = false;
  }

  addEyeExam() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً', 'تنبيه');
      return;
    }
    this.showExamForm = true;
    this.showConsultationForm = false;
    this.showAnalysisForm = false;
  }

  requestConsultation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً', 'تنبيه');
      return;
    }
    this.showConsultationForm = true;
    this.showExamForm = false;
    this.showAnalysisForm = false;
  }

  requestAnalysis() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً', 'تنبيه');
      return;
    }
    this.showAnalysisForm = true;
    this.showExamForm = false;
    this.showConsultationForm = false;
  }
}
