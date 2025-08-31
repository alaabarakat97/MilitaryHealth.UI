import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { InternalExam } from '../../../models/internal-exam.model';
import { InternalExamService } from '../../../services/internal-exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-internal-exam-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-internal-exam-component.html',
  styleUrl: './edit-internal-exam-component.scss'
})
export class EditInternalExamComponent {
 @Input() exam!: InternalExam;
  @Output() dialogClosed = new EventEmitter<boolean>();

  examForm!: FormGroup;
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: InternalExamService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      heart: [this.exam?.heart || '', Validators.required],
      respiratory: [this.exam?.respiratory || '', Validators.required],
      digestive: [this.exam?.digestive || '', Validators.required],
      endocrine: [this.exam?.endocrine || ''],
      neurology: [this.exam?.neurology || ''],
      blood: [this.exam?.blood || ''],
      joints: [this.exam?.joints || ''],
      kidney: [this.exam?.kidney || ''],
      hearing: [this.exam?.hearing || ''],
      skin: [this.exam?.skin || ''],
      resultID: [this.exam?.resultID || null, Validators.required],
      reason: [this.exam?.reason || '']
    });

    this.examService.getResults().subscribe({
      next: (res: any) => {
        this.results = res.data?.items || [];
        if (this.exam?.resultID) {
          this.examForm.patchValue({ resultID: this.exam.resultID });
        }
      },
      error: (err) => console.error('❌ Error loading results', err)
    });
  }

onSubmit() {
  if (!this.exam?.internalExamID) {
    alert('❌ لا يمكن التحديث: لا يوجد ID للفحص');
    return;
  }

  if (this.examForm.invalid) {
    alert('❌ يرجى تعبئة جميع الحقول المطلوبة');
    return;
  }

  const updatedExam: InternalExam = {
    ...this.exam,
    ...this.examForm.value,
    resultID: Number(this.examForm.value.resultID) // تأكد من أنه رقم
  };

  const examID: number = updatedExam.internalExamID!;

  this.examService.updateInternalExam(examID, updatedExam).subscribe({
    next: () => {
      alert('✅ تم التحديث بنجاح');
      this.exam.resultID = updatedExam.resultID; // فقط تحديث resultID
      this.dialogClosed.emit(true);
    },
    error: (err) => {
      console.error('❌ API error:', err);
      alert('❌ فشل التحديث، تحقق من ID أو الاتصال بالإنترنت');
    }
  });
}
  onCancel() {
    this.dialogClosed.emit(false);
  }
}