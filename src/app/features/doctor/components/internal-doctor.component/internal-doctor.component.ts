import { Component } from '@angular/core';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { InternalExamForm } from './internal-exam-form/internal-exam-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-internal-doctor.component',
  imports: [CommonModule, SearchApplicantComponent, InternalExamForm],
  templateUrl: './internal-doctor.component.html',
  styleUrl: './internal-doctor.component.scss'
})
export class InternalDoctorComponent {
 selectedApplicant: Applicant | null = null;
  showExamForm = false;

  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showExamForm = false;
  }

  addInternalExam() {
    if (!this.selectedApplicant) return alert('يرجى البحث عن مريض أولاً');
    this.showExamForm = true;
  }
}
