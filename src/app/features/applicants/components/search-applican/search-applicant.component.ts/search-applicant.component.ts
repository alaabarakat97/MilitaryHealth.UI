import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Applicant } from '../../../models/applicant.model';
import { ApplicantService } from '../../../services/applicant.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-applicant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './search-applicant.component.html',
  styleUrls: ['./search-applicant.component.scss']
})
export class SearchApplicantComponent  implements OnInit {
  searchForm!: FormGroup;
  applicant: Applicant | null = null;
  loading = false;

  @Output() applicantSelected = new EventEmitter<Applicant>();

  constructor(private fb: FormBuilder, private applicantService: ApplicantService) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fileNumber: ['']
    });
  }

  onSearch(): void {
    const fileNumber = this.searchForm.value.fileNumber?.trim();
    if (!fileNumber) return;

    this.loading = true;
    this.applicantService.getApplicantByFileNumber(fileNumber).subscribe({
      next: (applicant) => {
        this.applicant = applicant || null;
        if (!this.applicant) {
          alert('لم يتم العثور على منتسب بهذا الرقم');
        } else {
          this.applicantSelected.emit(this.applicant);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching applicant:', err);
        this.applicant = null;
        this.loading = false;
        alert('حدث خطأ أثناء جلب البيانات');
      }
    });
  }
}