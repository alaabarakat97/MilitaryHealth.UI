import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { InternalExam } from '../../../models/internal-exam.model';
import { InternalExamService } from '../../../services/internal-exam.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

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
    private examService: InternalExamService,
    private toastr: ToastrService // ✅ أضفنا toastr
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
      error: () => this.toastr.error('❌ فشل جلب قائمة النتائج', 'خطأ')
    });
  }

  onSubmit() {
    if (!this.exam?.internalExamID) {
      this.toastr.error('❌ لا يمكن التحديث: لا يوجد ID للفحص', 'خطأ');
      return;
    }

    if (this.examForm.invalid) {
      this.toastr.warning('❌ يرجى تعبئة جميع الحقول المطلوبة', 'تنبيه');
      return;
    }

    const updatedExam: InternalExam = {
      ...this.exam,
      ...this.examForm.value,
      resultID: Number(this.examForm.value.resultID)
    };

    const examID: number = updatedExam.internalExamID!;

    this.examService.updateInternalExam(examID, updatedExam).subscribe({
      next: () => {
        this.toastr.success('✅ تم التحديث بنجاح', 'نجاح');
        this.exam.resultID = updatedExam.resultID;
        this.dialogClosed.emit(true);
      },
      error: () => this.toastr.error('❌ فشل التحديث، تحقق من ID أو الاتصال بالإنترنت', 'خطأ')
    });
  }

  onCancel() {
    this.dialogClosed.emit(false);
  }
}
