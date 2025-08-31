// components/eye-doctor/eye-exam-form/eye-exam-form.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EyeExamService } from '../../../services/eye-exam.service';
import { EyeExam } from '../../../models/eye-exam-post.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eye-exam-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './eye-exam-form.html',
  styleUrls: ['./eye-exam-form.scss']
})
export class EyeExamForm implements OnInit {
  @Input() applicantFileNumber: string = ''; // رقم ملف المريض
  examForm!: FormGroup;

  refractionTypes: any[] = [];
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: EyeExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      vision: ['', Validators.required],
      colorTest: ['', Validators.required],
      refractionTypeID: [null, Validators.required], // اختيار نوع الانكسار
      refractionValue: [null, Validators.required], // القيمة الرقمية
      otherDiseases: [''], // نص عادي
      resultID: [null, Validators.required], // اختيار النتيجة
      reason: ['']
    });

    // جلب القوائم من الخدمة فقط للـ Select
    this.examService.getRefractionTypes().subscribe(res => this.refractionTypes = res.data.items);
    this.examService.getResults().subscribe(res => this.results = res.data.items);
  }

  onSubmit() {
  if (this.examForm.invalid) return;

  // جلب معرف الطبيب من localStorage وتحويله لرقم
  const doctorID = Number(this.authService.getDoctorId());
  if (!doctorID) {
    alert('❌ لم يتم العثور على معرف الطبيب');
    return;
  }

  // إنشاء كائن الفحص لإرساله
  const exam: EyeExam = {
    applicantFileNumber: this.applicantFileNumber,
    doctorID: doctorID, // رقم صحيح
    vision: this.examForm.value.vision,
    colorTest: this.examForm.value.colorTest, // نص مباشرة كما هو
    refractionTypeID: Number(this.examForm.value.refractionTypeID),
    refractionValue: Number(this.examForm.value.refractionValue),
    otherDiseases: this.examForm.value.otherDiseases || '',
    resultID: Number(this.examForm.value.resultID),
    reason: this.examForm.value.reason || ''
  };

  console.log('🚀 Data to send:', exam);

  this.examService.addEyeExam(exam).subscribe({
    next: () => {
      alert('✅ تمت إضافة الفحص بنجاح');
      this.examForm.reset();
    },
    error: (err) => {
      console.error('❌ API error:', err);
      alert('❌ حدث خطأ أثناء إضافة الفحص');
    }
  });
}

}
