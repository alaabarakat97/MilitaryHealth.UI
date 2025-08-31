import { Component } from '@angular/core';
import { Applicant } from '../../../applicants/models/applicant.model';
import { EyeExamForm } from './eye-exam-form/eye-exam-form';
import { SearchApplicantComponent } from '../../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-eye-doctor',
  standalone: true,
  imports: [SearchApplicantComponent, EyeExamForm,CommonModule],
  templateUrl: './eye-doctor.component.html',
  styleUrls: ['./eye-doctor.component.scss']
})
export class EyeDoctorComponent {
  selectedApplicant: Applicant | null = null;
  showExamForm = false;

  // 🔹 يلتقط المريض من SearchApplicantComponent
  onApplicantSelected(applicant: Applicant) {
    this.selectedApplicant = applicant;
    this.showExamForm = false;
  }

  addEyeExam() {
    if (!this.selectedApplicant) {
      alert('يرجى البحث عن مريض أولاً');
      return;
    }
    this.showExamForm = true;
  }
}
