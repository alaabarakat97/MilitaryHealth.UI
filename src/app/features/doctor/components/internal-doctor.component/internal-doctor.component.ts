import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { InternalExamForm } from './internal-exam-form/internal-exam-form';
import { InvestigationForm } from '../Investigations/investigation-form/investigation-form';
import { ConsultationFormComponent } from '../Consultations/consultation-form.component/consultation-form.component';
import { InternalExamService } from '../../services/internal-exam.service';

@Component({
  selector: 'app-internal-doctor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SearchApplicantComponent,
    InternalExamForm,
    ConsultationFormComponent,
    InvestigationForm
  ],
  templateUrl: './internal-doctor.component.html',
  styleUrls: ['./internal-doctor.component.scss'] // ✅ صححنا
})
export class InternalDoctorComponent {
  selectedApplicant: Applicant | null = null;
  hasInternalExam = false;

  @ViewChild(InternalExamForm) internalForm!: InternalExamForm;
  @ViewChild(ConsultationFormComponent) consultationForm!: ConsultationFormComponent;
  @ViewChild(InvestigationForm) investigationForm!: InvestigationForm;

  constructor(
    private toastr: ToastrService,
    private examService: InternalExamService
  ) {}

onApplicantSelected(applicant: Applicant) {
  this.selectedApplicant = applicant;

  this.examService.getByFileNumber(applicant.fileNumber).subscribe({
    next: (exam) => {
      // ✅ تحقّق إذا فعلاً فيه بيانات
      this.hasInternalExam = !!(exam && exam.internalExamID); 
    },
    error: () => this.hasInternalExam = false
  });
}


  addInternalExam() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    if (this.hasInternalExam) {
      this.toastr.error('المريض لديه فحص باطني سابق ولا يمكن إضافته مرة أخرى');
      return;
    }
    this.internalForm.openModal();
  }

  addConsultation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.consultationForm.openModal();
  }

  addInvestigation() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.investigationForm.openModal();
  }
}