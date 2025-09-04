import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { Investigation } from '../../../models/investigation.model';
import { EyeExamService } from '../../../services/eye-exam.service';
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
  previewUrl: string | null = null;
  loading: boolean = false;
  showModal: boolean = true; // 🔹 التحكم بالظهور مباشرة

  constructor(
    private fb: FormBuilder,
    private service: EyeExamService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  this.investigationForm = this.fb.group({
    type: [this.investigation.type], // مخفي ولا يمكن تعديله
    result: [this.investigation.result || ''],
    status: [this.investigation.result ? 'مكتمل' : 'مؤجل', Validators.required],
    attachment: [this.investigation.attachment || null]
  });

  if (this.investigation.attachment) {
    this.uploadedPath = this.investigation.attachment;
    this.previewUrl = this.uploadedPath;
  }

  // 🔹 مراقبة التغيرات على حقل النتيجة لتحديث الحالة تلقائيًا
  this.investigationForm.get('result')?.valueChanges.subscribe(value => {
    const statusControl = this.investigationForm.get('status');
    if (statusControl) {
      statusControl.setValue(value?.trim() ? 'مكتمل' : 'مؤجل', { emitEvent: false });
    }
  });
}

  closeModal() {
    this.showModal = false;
    this.dialogClosed.emit(false);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      reader.readAsDataURL(file);

      this.service.uploadFile(file).subscribe({
        next: (path) => {
          this.uploadedPath = path;
          this.investigationForm.patchValue({ attachment: path });
          this.toastr.success('✅ تم رفع الملف بنجاح', 'نجاح');
        },
        error: () => this.toastr.error('❌ فشل رفع الملف', 'خطأ')
      });
    }
  }

  onSubmit() {
    if (!this.investigationForm.valid) {
      this.toastr.warning('يرجى تعبئة الحقول المطلوبة', 'تنبيه');
      return;
    }

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

    this.loading = true;

    this.service.updateInvestigation(this.investigation.investigationID!, updatedInv)
      .subscribe({
        next: () => {
          this.toastr.success('تم تعديل التحليل بنجاح', 'نجاح');
          this.loading = false;
          this.closeModal();
        },
        error: () => {
          this.toastr.error('فشل التحديث', 'خطأ');
          this.loading = false;
        }
      });
  }
}
