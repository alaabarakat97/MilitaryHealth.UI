import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Applicant } from '../../../models/applicant.model';
import { ApplicantService } from '../../../services/applicant.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
export class SearchApplicantComponent implements OnInit {
 searchForm!: FormGroup;
  applicant: Applicant | null = null;
  loading = false;
  responseMessage: string | null = null;   // أضفنا المتغير

  @Output() applicantSelected = new EventEmitter<Applicant>();

  constructor(
    private fb: FormBuilder, 
    private applicantService: ApplicantService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fileNumber: ['']
    });
  }

  onSearch(): void {
    const fileNumber = this.searchForm.value.fileNumber?.trim();
    if (!fileNumber) {
      this.responseMessage = 'يرجى إدخال رقم الملف أولاً';
      return;
    }

    this.loading = true;
    this.applicantService.getApplicantByFileNumber(fileNumber).subscribe({
      next: (applicant) => {
        this.applicant = applicant || null;
        if (!this.applicant) {
          this.responseMessage = 'لم يتم العثور على منتسب بهذا الرقم';
        } else {
          this.responseMessage = null; // مسح الرسالة عند النجاح
          this.applicantSelected.emit(this.applicant);
        }
        this.loading = false;
      },
      error: () => {
        this.applicant = null;
        this.loading = false;
        this.responseMessage = 'حدث خطأ أثناء جلب البيانات';
      }
    });
  }
}