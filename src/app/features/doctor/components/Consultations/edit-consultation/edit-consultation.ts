import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EyeExamService } from '../../../services/eye-exam.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Consultation } from '../../../models/consultation.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/services/auth.service';

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
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: EyeExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // بناء الفورم مع بيانات الاستشارة الحالية
    this.consultationForm = this.fb.group({
      consultationType: [this.consultation.consultationType, Validators.required],
      referredDoctor: [this.consultation.referredDoctor, Validators.required],
      result: [this.consultation.result],
      attachment: [this.consultation.attachment || null]
    });

    this.uploadedPath = this.consultation.attachment || null;
  }

  // رفع الملف
onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    this.service.uploadFile(file).subscribe({
      next: (path) => {
        this.uploadedPath = path; 
        this.consultationForm.patchValue({ attachment: path });
        console.log('📂 File uploaded, path:', path);
      },
      error: (err) => {
        console.error('❌ File upload error:', err);
        alert('فشل رفع الملف');
      }
    });
  }
}

  onSubmit() {
    if (!this.consultation || this.consultationForm.invalid) {
      alert('❌ يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    this.loading = true;

    const doctorID = Number(this.authService.getDoctorId());
    if (!doctorID) {
      alert('❌ لم يتم العثور على معرف الطبيب');
      this.loading = false;
      return;
    }

    const updatedConsultation: Consultation = {
      ...this.consultation,
      doctorID,
      applicantFileNumber: this.consultation.applicantFileNumber,
      consultationType: this.consultationForm.value.consultationType,
      referredDoctor: this.consultationForm.value.referredDoctor,
      result: this.consultationForm.value.result,
      attachment: this.uploadedPath ?? ''
    };

    this.service.updateConsultation(this.consultation.consultationID!, updatedConsultation).subscribe({
      next: () => {
        alert('✅ تم التحديث بنجاح');
        this.loading = false;
        this.dialogClosed.emit(true);
      },
      error: (err) => {
        console.error('❌ API error:', err);
        alert('❌ فشل التحديث');
        this.loading = false;
      }
    });
  }

  onCancel() {
    this.dialogClosed.emit(false);
  }
}