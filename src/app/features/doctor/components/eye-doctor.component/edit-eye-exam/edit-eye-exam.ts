import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { EyeExam } from '../../../models/eye-exam-post.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-eye-exam',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-eye-exam.html',
  styleUrl: './edit-eye-exam.scss'
})
export class EditEyeExam {
 @Input() exam!: EyeExam;
  @Output() dialogClosed = new EventEmitter<boolean>();

  examForm!: FormGroup;
  refractionTypes: any[] = [];
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: EyeExamService
  ) {}

  ngOnInit(): void {
    // بناء الفورم مع ملء البيانات الحالية
    this.examForm = this.fb.group({
      vision: [this.exam.vision, Validators.required],
      colorTest: [this.exam.colorTest, Validators.required],
      refractionTypeID: [this.exam.refractionTypeID, Validators.required],
      refractionValue: [this.exam.refractionValue, Validators.required],
      otherDiseases: [this.exam.otherDiseases || ''],
      resultID: [this.exam.resultID, Validators.required],
      reason: [this.exam.reason || '']
    });

    // جلب قوائم Select
    this.examService.getRefractionTypes().subscribe(res => this.refractionTypes = res.data.items);
    this.examService.getResults().subscribe(res => this.results = res.data.items);
  }

  onSubmit() {
    if (!this.exam || this.examForm.invalid) {
      alert('❌ يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const updatedExam: EyeExam = {
      ...this.exam,
      ...this.examForm.value,
      refractionTypeID: Number(this.examForm.value.refractionTypeID),
      refractionValue: Number(this.examForm.value.refractionValue),
      resultID: Number(this.examForm.value.resultID)
    };

    // نفترض أن الـ API يستخدم حقل ID غير موجود بالـ interface
    const examID = (this.exam as any).eyeExamID; 

    this.examService.updateEyeExam(examID, updatedExam).subscribe({
      next: () => {
        alert('✅ تم التحديث بنجاح');
        this.dialogClosed.emit(true); // إغلاق النافذة وتحديث الجدول
      },
      error: (err) => {
        console.error('❌ API error:', err);
        alert('❌ فشل التحديث');
      }
    });
  }

  onCancel() {
    this.dialogClosed.emit(false);
  }
}