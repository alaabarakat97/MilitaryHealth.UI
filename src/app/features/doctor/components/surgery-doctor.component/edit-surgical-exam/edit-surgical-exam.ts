import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SurgicalExam } from '../../../models/surgical-exam-post.model';
import { CommonModule } from '@angular/common';
import { SurgicalExamService } from '../../../services/surgical-exam.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-surgical-exam',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-surgical-exam.html',
  styleUrls: ['./edit-surgical-exam.scss']
})
export class EditSurgicalExam implements OnInit {
  @Input() exam!: SurgicalExam;  
  @Output() dialogClosed = new EventEmitter<boolean>(); 

  examForm!: FormGroup;
  results: any[] = []; 

  constructor(
    private fb: FormBuilder,
    private examService: SurgicalExamService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      generalSurgery: [this.exam?.generalSurgery || '', Validators.required],
      urinarySurgery: [this.exam?.urinarySurgery || '', Validators.required],
      vascularSurgery: [this.exam?.vascularSurgery || '', Validators.required],
      thoracicSurgery: [this.exam?.thoracicSurgery || '', Validators.required],
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
      error: () => this.toastr.error('❌ فشل تحميل النتائج')
    });
  }

  onSubmit() {
    if (!this.exam?.surgicalExamID) {
      this.toastr.error('❌ لا يمكن التحديث: لا يوجد ID للفحص');
      return;
    }

    if (this.examForm.invalid) {
      this.toastr.warning('❌ يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const updatedExam: SurgicalExam = {
      ...this.exam,
      ...this.examForm.value,
      resultID: Number(this.examForm.value.resultID) 
    };

    const examID: number = updatedExam.surgicalExamID!;

    this.examService.updateSurgicalExam(examID, updatedExam).subscribe({
      next: () => {
        this.toastr.success('✅ تم التحديث بنجاح');
        this.exam.result = this.results.find(r => r.resultID === updatedExam.resultID);
        this.exam.resultID = updatedExam.resultID; 
        this.dialogClosed.emit(true);
      },
      error: () => this.toastr.error('❌ فشل التحديث، تحقق من ID أو الاتصال بالإنترنت')
    });
  }

  onCancel() {
    this.dialogClosed.emit(false);
  }
}
