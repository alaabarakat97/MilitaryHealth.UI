import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Consultation } from '../../../models/consultation.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consultation-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss'
})
export class ConsultationFormComponent {
 @Input() applicantFileNumber: string = '';
  consultationForm!: FormGroup;
  uploadedPath: string | null = null;
  loading: boolean = false; // 🔹 أضفنا هذه الخاصية

  constructor(
    private fb: FormBuilder,
    private consultationService: EyeExamService,
    private authService: AuthService,
    private toastr: ToastrService // ✅ أضفنا ToastrService
  ) {}

  ngOnInit(): void {
    this.consultationForm = this.fb.group({
      consultationType: ['', Validators.required],
      referredDoctor: ['', Validators.required],
      result: [null],
      attachment: [null]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.consultationService.uploadFile(file).subscribe({
        next: (path) => {
          this.uploadedPath = path; // 🔹 فقط المسار
          this.consultationForm.patchValue({ attachment: path });
          console.log('📂 File uploaded, path:', path);
          this.toastr.success('✅ تم رفع الملف بنجاح', 'نجاح');
        },
        error: (err) => {
          console.error('❌ File upload error:', err);
          this.toastr.error('فشل رفع الملف', 'خطأ');
        }
      });
    }
  }

  // إرسال الاستشارة
  onSubmit() {
    if (this.consultationForm.invalid || !this.applicantFileNumber) {
      this.toastr.warning('يرجى إدخال جميع الحقول', 'تحذير');
      return;
    }

    // جلب معرف الطبيب من AuthService
    const doctorID = Number(this.authService.getDoctorId());
    if (!doctorID) {
      this.toastr.error('❌ لم يتم العثور على معرف الطبيب', 'خطأ');
      return;
    }

    const consultation: Consultation = {
      doctorID,
      applicantFileNumber: this.applicantFileNumber,
      consultationType: this.consultationForm.value.consultationType,
      referredDoctor: this.consultationForm.value.referredDoctor,
      result: this.consultationForm.value.result,
      attachment: this.uploadedPath ?? ''
    };

    this.consultationService.addConsultation(consultation).subscribe({
      next: (res) => {
        this.toastr.success('✅ تم إضافة الاستشارة بنجاح', 'نجاح');
        this.consultationForm.reset();
      },
      error: (err) => {
        console.error('❌ خطأ في إضافة الاستشارة:', err);
        this.toastr.error('فشل في إضافة الاستشارة', 'خطأ');
      }
    });
  }
}