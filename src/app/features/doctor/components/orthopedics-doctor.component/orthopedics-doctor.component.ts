import { Component, ViewChild } from '@angular/core';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { CommonModule } from '@angular/common';
import { OrthopedicExamFormComponent } from './orthopedic-exam-form.component/orthopedic-exam-form.component';
import { ConsultationFormComponent } from '../Consultations/consultation-form.component/consultation-form.component';
import { InvestigationForm } from '../Investigations/investigation-form/investigation-form';
import { ToastrService } from 'ngx-toastr';
import { OrthopedicExamService } from '../../services/orthopedic-exam.service';

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
  hasOrthopedicExam = false;

  @ViewChild(OrthopedicExamFormComponent) orthopedicForm!: OrthopedicExamFormComponent;
  @ViewChild(ConsultationFormComponent) consultationForm!: ConsultationFormComponent;
  @ViewChild(InvestigationForm) investigationForm!: InvestigationForm;

  constructor(
    private toastr: ToastrService,
    private orthopedicService: OrthopedicExamService
  ) {}

  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;

    if (applicant?.fileNumber) {
      this.orthopedicService.getByFileNumber(applicant.fileNumber).subscribe({
        next: (exam) => this.hasOrthopedicExam = !!exam,
        error: () => this.hasOrthopedicExam = false
      });
    }
  }

  addOrthopedicExam() {
    if (!this.selectedApplicant) {
      this.toastr.warning('يرجى البحث عن مريض أولاً');
      return;
    }
    this.orthopedicForm.openModal();
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