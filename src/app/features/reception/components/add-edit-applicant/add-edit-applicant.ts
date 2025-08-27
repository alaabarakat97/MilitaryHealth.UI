import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-edit-applicant',
  imports: [CommonModule,ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './add-edit-applicant.html',
  styleUrl: './add-edit-applicant.scss'
})
export class AddEditApplicant {
form: FormGroup;
  submitted = false;
  loading = false;
  message = '';
  success = false;

  maritalStatuses = [
    { id: 1, name: 'أعزب' },
    { id: 2, name: 'متزوج' },
    { id: 3, name: 'مطلق' },
    { id: 4, name: 'أرمل' }
  ];

  private apiUrl = 'https://your-api-url.com/users'; 

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      FullName: ['', Validators.required],
      MaritalStatusID: [null, Validators.required],
      Job: ['',Validators.required],
      Height: [null,Validators.required],
      Weight: [null,Validators.required],
      BMI: [null,Validators.required],
      BloodPressure: ['',Validators.required],
      Pulse: [null,Validators.required],
      Tattoo: [false,Validators.required],
      DistinctiveMarks: ['',Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.message = '';
    if (this.form.invalid) return;

    this.loading = true;
    const payload = this.form.getRawValue(); // عشان يجيب BMI كمان

    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        this.success = true;
        this.message = 'تم الحفظ بنجاح ✅';
        this.loading = false;
        this.onReset();
      },
      error: () => {
        this.success = false;
        this.message = 'حصل خطأ أثناء الإرسال ❌';
        this.loading = false;
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.form.reset({
      Tattoo: false
    });
  }

  // Getters & Helpers
  get f() {
    return this.form.controls;
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
