import { Component } from '@angular/core';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { CommonModule } from '@angular/common';
import { SurgicalExamForm } from './surgical-exam-form/surgical-exam-form';

@Component({
  selector: 'app-surgery-doctor.component',
  imports: [SearchApplicantComponent, SurgicalExamForm, CommonModule], 
  templateUrl: './surgery-doctor.component.html',
  styleUrl: './surgery-doctor.component.scss'
})
export class SurgeryDoctorComponent {
  selectedApplicant: Applicant | null = null;
  showExamForm = false;

  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showExamForm = false;
  }

  addSurgicalExam() {
  if (!this.selectedApplicant) {
    alert('يرجى البحث عن مريض أولاً');
    return;
  }
  this.showExamForm = true; // فتح الفورم بعد التحقق
}

}