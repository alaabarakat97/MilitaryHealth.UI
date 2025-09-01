import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { Investigation } from '../../../models/investigation.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-investigation',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-investigation.html',
  styleUrl: './edit-investigation.scss'
})
export class EditInvestigation {
  @Input() investigation!: Investigation;
  @Output() dialogClosed = new EventEmitter<boolean>();

  investigationForm!: FormGroup;
  uploadedPath: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: EyeExamService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.investigationForm = this.fb.group({
      type: [this.investigation.type, Validators.required],
      result: [this.investigation.result],
      status: [this.investigation.status, Validators.required],
      attachment: [this.investigation.attachment || null]
    });
    this.uploadedPath = this.investigation.attachment || null;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.service.uploadFile(file).subscribe({
        next: (path) => {
          this.uploadedPath = path;
          this.investigationForm.patchValue({ attachment: path });
          this.toastr.success('تم رفع الملف بنجاح', 'نجاح');
        },
        error: () => this.toastr.error('فشل رفع الملف', 'خطأ')
      });
    }
  }

  onSubmit() {
    if (!this.investigation || this.investigationForm.invalid) {
      this.toastr.warning('يرجى تعبئة الحقول المطلوبة', 'تنبيه');
      return;
    }

    this.loading = true;
    const doctorID = Number(this.authService.getDoctorId());

    const updatedInv: Investigation = {
      ...this.investigation,
      doctorID,
      applicantFileNumber: this.investigation.applicantFileNumber,
      type: this.investigationForm.value.type,
      result: this.investigationForm.value.result,
      status: this.investigationForm.value.status,
      attachment: this.uploadedPath ?? ''
    };

    this.service.updateInvestigation(this.investigation.investigationID!, updatedInv).subscribe({
      next: () => {
        this.toastr.success('تم التحديث بنجاح', 'نجاح');
        this.loading = false;
        this.dialogClosed.emit(true);
      },
      error: () => {
        this.toastr.error('فشل التحديث', 'خطأ');
        this.loading = false;
      }
    });
  }

  onCancel() { this.dialogClosed.emit(false); }
}
