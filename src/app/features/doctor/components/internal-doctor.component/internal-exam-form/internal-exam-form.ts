import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { InternalExam } from '../../../models/internal-exam.model';
import { InternalExamService } from '../../../services/internal-exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-internal-exam-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './internal-exam-form.html',
  styleUrl: './internal-exam-form.scss'
})
export class InternalExamForm implements OnInit {
  @Input() applicantFileNumber: string = '';
  examForm!: FormGroup;
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: InternalExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      heart: ['', Validators.required],
      respiratory: ['', Validators.required],
      digestive: ['', Validators.required],
      endocrine: ['', Validators.required],
      neurology: ['', Validators.required],
      blood: ['', Validators.required],
      joints: ['', Validators.required],
      kidney: ['', Validators.required],
      hearing: ['', Validators.required],
      skin: ['', Validators.required],
      resultID: [null, Validators.required],
      reason: ['']
    });

    this.examService.getResults().subscribe(res => this.results = res.data.items);
  }

onSubmit() {
  if (this.examForm.invalid) return;

  const payload: InternalExam = {
    applicantFileNumber: this.applicantFileNumber, // لازم تجيبها من المريض الحالي
    doctorID: this.authService.getDoctorId(),      // أو من التوكن/السيشن
    ...this.examForm.value,
    resultID: Number(this.examForm.value.resultID) // تحويل من string → number
  };

  console.log("📤 Sending InternalExam:", payload);

  this.examService.addInternalExam(payload).subscribe({
    next: () => {
      alert("تمت الاضافة بنجاح:");
      // ممكن تسكر المودال أو تعرض رسالة نجاح
    },
    error: (err) => {
       if (err.error?.errors?.detail?.[0] === "Applicant already registered before.") {
        alert("⚠️ هذا المتقدم مسجل مسبقاً، استخدم التحديث بدل الإضافة.");
        return;
      }
      console.error("❌ API error:", err);
    }
  });
}
}