import { Component, ViewChild } from '@angular/core';
import { Applicant } from '../../../applicants/models/applicant.model';
import { EyeExamForm } from './eye-exam-form/eye-exam-form';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { CommonModule } from '@angular/common';
import { ConsultationFormComponent } from '../Consultations/consultation-form.component/consultation-form.component';
import { InvestigationForm } from '../Investigations/investigation-form/investigation-form';
import { ToastrService } from 'ngx-toastr';
import { EyeExamService } from '../../services/eye-exam.service';

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
    hasEyeExam = false; 

  @ViewChild('eyeExamForm') eyeExamForm!: EyeExamForm;
  @ViewChild('consultationForm') consultationForm!: ConsultationFormComponent;
  @ViewChild('investigationForm') investigationForm!: InvestigationForm;

  constructor(private toastr: ToastrService, private eyeExamService :EyeExamService) {}



onApplicantSelected(applicant: Applicant) {
  this.selectedApplicant = applicant;

  if (applicant?.fileNumber) {
    // جلب الفحوص السابقة
    this.eyeExamService.getByFileNumber(applicant.fileNumber).subscribe({
      next: (exam) => this.hasEyeExam = !!exam,
      error: () => this.hasEyeExam = false
    });
  }
}



  addEyeExam() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً', 'تنبيه');
      return;
    }
    this.eyeExamForm.openModal();
  }

  addConsultation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً', 'تنبيه');
      return;
    }
    this.consultationForm.openModal();
  }

  addInvestigation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً', 'تنبيه');
      return;
    }
    this.investigationForm.openModal();
  }
}