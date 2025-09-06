import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { EyeExam } from '../../../models/eye-exam-post.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-eye-exam',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-eye-exam.html',
  styleUrl: './edit-eye-exam.scss'
})
export class EditEyeExam {
  @Output() eyeExamUpdated = new EventEmitter<any>();
  @Input() exam!: EyeExam;
  
  @Output() dialogClosed = new EventEmitter<boolean>();

  examForm!: FormGroup;
  refractionTypes: any[] = [];
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: EyeExamService,
    private toastr: ToastrService ,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      vision: [this.exam.vision, Validators.required],
      colorTest: [this.exam.colorTest, Validators.required],
      refractionTypeID: [this.exam.refractionTypeID, Validators.required],
      refractionValue: [this.exam.refractionValue, Validators.required],
      otherDiseases: [this.exam.otherDiseases || ''],
      resultID: [this.exam.resultID, Validators.required],
      reason: [this.exam.reason || '']
    });

    this.examService.getRefractionTypes().subscribe(res => this.refractionTypes = res.data.items);
    this.examService.getResults().subscribe(res => this.results = res.data.items);
  }

  onSubmit() {
    if (!this.exam || this.examForm.invalid) {
      this.toastr.warning('❌ يرجى تعبئة جميع الحقول المطلوبة', 'تحذير');
      return;
    }

    const updatedExam: EyeExam = {
      ...this.exam,
      ...this.examForm.value,
      refractionTypeID: Number(this.examForm.value.refractionTypeID),
      refractionValue: Number(this.examForm.value.refractionValue),
      resultID: Number(this.examForm.value.resultID)
    };

    const examID = (this.exam as any).eyeExamID; 

    this.examService.updateEyeExam(examID, updatedExam).subscribe({
      next: () => {
        this.toastr.success('✅ تم التحديث بنجاح', 'نجاح');
        this.dialogClosed.emit(true); // إغلاق النافذة وتحديث الجدول
      },
      error: () => {
        this.toastr.error('❌ فشل التحديث', 'خطأ');
      }
    });
  }
 
  cancel() {
  this.modalService.dismissAll();
  }
}
