import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EyeExamService } from '../../../services/eye-exam.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Consultation } from '../../../models/consultation.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-consultation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-consultation.html',
  styleUrls: ['./edit-consultation.scss']
})
export class EditConsultation {
  @Input() consultation!: Consultation;
  @Output() dialogClosed = new EventEmitter<boolean>();

  consultationForm!: FormGroup;
  uploadedPath: string | null = null;
  previewUrl: string | null = null;
  loading = false;
  showModal = true;

  constructor(
    private fb: FormBuilder,
    private service: EyeExamService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.consultationForm = this.fb.group({
      consultationType: [this.consultation.consultationType], // مخفي
      referredDoctor: [this.consultation.referredDoctor], // مخفي
      result: [this.consultation.result || ''],
      attachment: [this.consultation.attachment || null]
    });

    if (this.consultation.attachment) {
      this.uploadedPath = this.consultation.attachment;
      this.previewUrl = this.uploadedPath;
    }
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
          this.consultationForm.patchValue({ attachment: path });
          this.toastr.success('✅ تم رفع الملف بنجاح', 'نجاح');
        },
        error: () => this.toastr.error('❌ فشل رفع الملف', 'خطأ')
      });
    }
  }

  onSubmit() {
    if (!this.consultationForm.valid) {
      this.toastr.warning('❌ يرجى تعبئة جميع الحقول المطلوبة', 'تحذير');
      return;
    }

    const doctorID = Number(this.authService.getDoctorId());
    if (!doctorID) return;

    const updatedConsultation: Consultation = {
      ...this.consultation,
      doctorID,
      applicantFileNumber: this.consultation.applicantFileNumber,
      consultationType: this.consultationForm.value.consultationType,
      referredDoctor: this.consultationForm.value.referredDoctor,
      result: this.consultationForm.value.result,
      attachment: this.uploadedPath ?? ''
    };

    this.loading = true;

    this.service.updateConsultation(this.consultation.consultationID!, updatedConsultation)
      .subscribe({
        next: () => {
          this.toastr.success('✅ تم التحديث بنجاح', 'نجاح');
          this.loading = false;
          this.closeModal();
        },
        error: () => {
          this.toastr.error('❌ فشل التحديث', 'خطأ');
          this.loading = false;
        }
      });
  }
}
