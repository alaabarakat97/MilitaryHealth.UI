import { Component } from '@angular/core';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { Applicant } from '../../../applicants/models/applicant.model';
import { CommonModule } from '@angular/common';
import { OrthopedicExamFormComponent } from './orthopedic-exam-form.component/orthopedic-exam-form.component';

@Component({
  selector: 'app-orthopedics-doctor.component',
   standalone: true,
  imports: [SearchApplicantComponent,OrthopedicExamFormComponent, CommonModule],
  templateUrl: './orthopedics-doctor.component.html',
  styleUrl: './orthopedics-doctor.component.scss'
})
export class OrthopedicsDoctorComponent {
  selectedApplicant: Applicant | null = null;
  showExamForm = false;

  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showExamForm = false;
  }

 addOrthopedicExam() {
  if (!this.selectedApplicant) {
    alert('يرجى البحث عن مريض أولاً');
    return;
  }
  this.showExamForm = true; // فتح الفورم بعد التحقق
}

}