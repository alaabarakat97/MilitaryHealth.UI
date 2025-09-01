import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrthopedicExam } from '../../../models/orthopedic-exam.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-orthopedic-exam',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './edit-orthopedic-exam.component.html',
  styleUrl: './edit-orthopedic-exam.component.scss'
})
export class EditOrthopedicExamComponent implements OnInit {
  @Input() exam!: OrthopedicExam;
  @Output() dialogClosed = new EventEmitter<boolean>();

  examForm!: FormGroup;
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: OrthopedicExamService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      musculoskeletal: [this.exam?.musculoskeletal || '', Validators.required],
      neurologicalSurgery: [this.exam?.neurologicalSurgery || '', Validators.required],
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
      error: err => this.toastr.error('❌ فشل جلب النتائج', 'خطأ')
    });
  }

  onSubmit() {
    if (!this.exam?.orthopedicExamID) {
      this.toastr.error('❌ لا يمكن التحديث: لا يوجد ID للفحص', 'خطأ');
      return;
    }

    if (this.examForm.invalid) {
      this.toastr.warning('يرجى تعبئة جميع الحقول المطلوبة', 'تحذير');
      return;
    }

    const updatedExam: OrthopedicExam = {
      ...this.exam,
      ...this.examForm.value,
      resultID: Number(this.examForm.value.resultID)
    };

    this.examService.updateOrthopedicExam(this.exam.orthopedicExamID, updatedExam).subscribe({
      next: () => {
        this.toastr.success('✅ تم التحديث بنجاح', 'نجاح');
        this.exam.resultID = updatedExam.resultID;
        this.exam.result = this.results.find(r => r.resultID === updatedExam.resultID);
        this.dialogClosed.emit(true);
      },
      error: err => this.toastr.error('❌ فشل التحديث', 'خطأ')
    });
  }

  onCancel() {
    this.dialogClosed.emit(false);
  }
}
