import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { Investigation } from '../../../models/investigation.model';
import { EyeExamService } from '../../../services/eye-exam.service';

@Component({
  selector: 'app-investigation-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './investigation-form.html',
  styleUrl: './investigation-form.scss'
})
export class InvestigationForm {
 @Input() applicantFileNumber: string = '';
  @Input() investigationToEdit?: Investigation;

  investigationForm!: FormGroup;
  uploadedPath: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: EyeExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.investigationForm = this.fb.group({
      type: [this.investigationToEdit?.type || '', Validators.required],
      result: [this.investigationToEdit?.result || ''],
      attachment: [this.investigationToEdit?.attachment || null],
      status: [this.investigationToEdit?.status || 'مؤجل', Validators.required]
    });

    if (this.investigationToEdit?.attachment) {
      this.uploadedPath = this.investigationToEdit.attachment;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.service.uploadFile(file).subscribe({
        next: (path) => {
          this.uploadedPath = path;
          this.investigationForm.patchValue({ attachment: path });
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
    if (!this.applicantFileNumber || this.investigationForm.invalid) {
      alert('يرجى إدخال جميع الحقول المطلوبة');
      return;
    }

    const doctorID = Number(this.authService.getDoctorId());
    if (!doctorID) {
      alert('❌ لم يتم العثور على معرف الطبيب');
      return;
    }

    const investigation: Investigation = {
      ...this.investigationToEdit,
      doctorID,
      applicantFileNumber: this.applicantFileNumber,
      type: this.investigationForm.value.type,
      result: this.investigationForm.value.result,
      status: this.investigationForm.value.status,
      attachment: this.uploadedPath ?? ''
    };

    this.loading = true;

    const request$ = this.investigationToEdit
      ? this.service.updateInvestigation(this.investigationToEdit.investigationID!, investigation)
      : this.service.addInvestigation(investigation);

    request$.subscribe({
      next: () => {
        alert(this.investigationToEdit ? '✅ تم تعديل التحليل بنجاح' : '✅ تم إضافة طلب التحليل بنجاح');
        this.investigationForm.reset();
        this.uploadedPath = null;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ خطأ في العملية:', err);
        alert('فشل في العملية');
        this.loading = false;
      }
    });
  }
}