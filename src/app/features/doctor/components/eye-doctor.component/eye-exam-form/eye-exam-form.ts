// components/eye-doctor/eye-exam-form/eye-exam-form.ts
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EyeExamService } from '../../../services/eye-exam.service';
import { EyeExam } from '../../../models/eye-exam-post.model';
import { AuthService } from '../../../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
    private authService: AuthService,
    private toastr: ToastrService // ✅ أضفنا Toastr
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      vision: ['', Validators.required],
      colorTest: ['', Validators.required],
      refractionTypeID: [null, Validators.required],
      refractionValue: [null, Validators.required],
      otherDiseases: [''],
      resultID: [null, Validators.required],
      reason: ['']
    });

    // جلب القوائم
    this.examService.getRefractionTypes().subscribe(res => this.refractionTypes = res.data.items);
    this.examService.getResults().subscribe(res => this.results = res.data.items);
  }

  onSubmit() {
    if (this.examForm.invalid) {
      this.toastr.warning('⚠️ يرجى تعبئة جميع الحقول المطلوبة', 'تنبيه');
      return;
    }

    const doctorID = Number(this.authService.getDoctorId());
    if (!doctorID) {
      this.toastr.error('❌ لم يتم العثور على معرف الطبيب', 'خطأ');
      return;
    }

    const exam: EyeExam = {
      applicantFileNumber: this.applicantFileNumber,
      doctorID: doctorID,
      vision: this.examForm.value.vision,
      colorTest: this.examForm.value.colorTest,
      refractionTypeID: Number(this.examForm.value.refractionTypeID),
      refractionValue: Number(this.examForm.value.refractionValue),
      otherDiseases: this.examForm.value.otherDiseases || '',
      resultID: Number(this.examForm.value.resultID),
      reason: this.examForm.value.reason || ''
    };

    this.examService.addEyeExam(exam).subscribe({
      next: () => {
        this.toastr.success('✅ تمت إضافة الفحص بنجاح', 'نجاح');
        this.examForm.reset();
      },
      error: () => {
        this.toastr.error('❌ حدث خطأ أثناء إضافة الفحص', 'خطأ');
      }
    });
  }
}
