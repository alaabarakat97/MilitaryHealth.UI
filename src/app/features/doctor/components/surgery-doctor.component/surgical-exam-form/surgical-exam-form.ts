import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { SurgicalExam } from '../../../models/surgical-exam-post.model';
import { SurgicalExamService } from '../../../services/surgical-exam.service';

@Component({
  selector: 'app-surgical-exam-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './surgical-exam-form.html',
  styleUrl: './surgical-exam-form.scss'
})
export class SurgicalExamForm implements OnInit {
  @Input() applicantFileNumber: string = '';
  examForm!: FormGroup;

  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: SurgicalExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      generalSurgery: ['', Validators.required],
      urinarySurgery: ['', Validators.required],
      vascularSurgery: ['', Validators.required],
      thoracicSurgery: ['', Validators.required],
      resultID: [null, Validators.required],
      reason: ['']
    });

    this.examService.getResults().subscribe(res => this.results = res.data.items);
  }

  onSubmit() {
  if (this.examForm.invalid) return;

  const doctorID = Number(this.authService.getDoctorId());
  if (!doctorID) {
    alert('❌ لم يتم العثور على معرف الطبيب');
    return;
  }

  const exam: SurgicalExam = {
    applicantFileNumber: this.applicantFileNumber,
    doctorID: doctorID,
    generalSurgery: this.examForm.value.generalSurgery,
    urinarySurgery: this.examForm.value.urinarySurgery,
    vascularSurgery: this.examForm.value.vascularSurgery,
    thoracicSurgery: this.examForm.value.thoracicSurgery,
    resultID: Number(this.examForm.value.resultID),
    reason: this.examForm.value.reason || ''
  };


  this.examService.addSurgicalExam(exam).subscribe({
    next: () => {
      alert('✅ تمت إضافة الفحص الجراحي بنجاح');
      this.examForm.reset();
    },
    error: (err: any) => {
      console.error('❌ API error:', err);

      // تحقق من رسالة الخطأ القادمة من السيرفر
      if (err?.error?.errors?.detail?.includes('Applicant already registered before')) {
        alert('⚠️ هذا المريض مسجّل مسبقًا. لا يمكن إضافة فحص جديد لنفس الرقم.');
      } else {
        alert('❌ حدث خطأ أثناء إضافة الفحص الجراحي');
        alert('⚠️ربما هذا المريض مسجّل مسبقًا. لا يمكن إضافة فحص جديد لنفس الرقم.');
      }
    }
  });
}
}