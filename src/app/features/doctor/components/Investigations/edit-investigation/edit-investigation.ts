import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { Investigation } from '../../../models/investigation.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';

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
    private authService: AuthService
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
      this.service.uploadFile(file).subscribe(path => {
        this.uploadedPath = path;
        this.investigationForm.patchValue({ attachment: path });
      });
    }
  }

  onSubmit() {
    if (!this.investigation || this.investigationForm.invalid) return alert('يرجى تعبئة الحقول المطلوبة');

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
      next: () => { alert('✅ تم التحديث'); this.loading = false; this.dialogClosed.emit(true); },
      error: () => { alert('❌ فشل التحديث'); this.loading = false; }
    });
  }

  onCancel() { this.dialogClosed.emit(false); }
}