import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaritalStatus } from '../../models/marital-status.model';
import { MaritalStatusService } from '../../services/marital-status.service';
import { ApplicantModel } from '../../models/applicant.model';
import { ApplicantService } from '../../services/applicant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { ApiResponse } from '../../../../shared/models/paged-response.model';

@Component({
  selector: 'app-add-edit-applicant',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './add-edit-applicant.html',
  styleUrl: './add-edit-applicant.scss'
})
export class AddEditApplicant implements OnInit {
    applicantForm!: FormGroup;
  maritalStatuses: MaritalStatus[] = [];
  applicantId!: number;
  fileNumber: string = '';
  submitted = false;
  loading = false;
  message = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private maritalStatusService: MaritalStatusService,
    private applicantService: ApplicantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.loadMaritalStatuses();

    this.route.paramMap.subscribe(params => {
  const id = params.get('id');
  if (id) {
    this.applicantId = +id;
    this.loadApplicant(this.applicantId);
  }
});
  }

  loadForm() {
    this.applicantForm = this.fb.group({
      fullName: ['', Validators.required],
      maritalStatusID: [null, Validators.required],
      job: ['', Validators.required],
      height: [null, Validators.required],
      weight: [null, Validators.required],
      bmi: [null, Validators.required],
      bloodPressure: ['', Validators.required],
      pulse: [null, Validators.required],
      tattoo: [false, Validators.required],
      distinctiveMarks: ['', Validators.required]
    });
  }

  loadMaritalStatuses() {
    this.maritalStatusService.getMaritalStatus().subscribe({
      next: (data) => (this.maritalStatuses = data),
      error: (err) => console.error('Error fetching marital statuses', err)
    });
  }

  loadApplicant(id: number) {
    this.applicantService.getApplicantById$(id).subscribe({
      next: (applicant: ApplicantModel) => {
        this.applicantForm.patchValue(applicant); 
        this.fileNumber = applicant.fileNumber;
      },
      error: () => console.error('Error fetching applicant data')
    });
  }
preventMinus(event: KeyboardEvent) {
  if (event.key === '-' || event.key === 'e') {
    event.preventDefault();
  }
}

  onSubmit() {
    this.submitted = true;
    if (this.applicantForm.invalid) return;

    const applicantModel: ApplicantModel = this.applicantForm.getRawValue();
    this.loading = true;

    if (!this.applicantId) {
      this.applicantService.createApplicant(applicantModel)
        .pipe(
          tap((res: ApiResponse<ApplicantModel>) => {
            console.log(res);
            this.success = true;
            this.applicantId = res.data.applicantID;
            this.router.navigate(['reception/applicants/', res.data.applicantID]);
          })
        )
        .subscribe({
          error: () => {
            this.success = false;
            this.loading = false;
          }
        });
    } else {
      this.applicantService.updateApplicant(this.applicantId, applicantModel).subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
        },
        error: () => {
          this.success = false;
          this.loading = false;
        }
      });
    }
  }

  get f() {
    return this.applicantForm.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.f[controlName];
    return control.valid && (control.dirty || control.touched || this.submitted);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.f[controlName];
    return control.invalid && (control.dirty || control.touched || this.submitted);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.f[controlName];
    return control.hasError(validation) && (control.dirty || control.touched || this.submitted);
  }

  isControlTouched(controlName: string): boolean {
    const control = this.f[controlName];
    return control.dirty || control.touched || this.submitted;
  }
}
