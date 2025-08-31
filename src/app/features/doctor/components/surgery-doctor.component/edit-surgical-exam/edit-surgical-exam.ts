import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { SurgicalExam } from '../../../models/surgical-exam-post.model';
import { CommonModule } from '@angular/common';
import { SurgicalExamService } from '../../../services/surgical-exam.service';

@Component({
  selector: 'app-edit-surgical-exam',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-surgical-exam.html',
  styleUrl: './edit-surgical-exam.scss'
})
export class EditSurgicalExam implements OnInit{
  @Input() exam!: SurgicalExam;  
  @Output() dialogClosed = new EventEmitter<boolean>(); 

  examForm!: FormGroup;
  results: any[] = []; 

  constructor(
    private fb: FormBuilder,
    private examService: SurgicalExamService
  ) {}

  ngOnInit(): void {
    // بناء الفورم
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
      error: (err) => console.error('❌ Error loading results', err)
    });
  }

  onSubmit() {
    if (!this.exam?.surgicalExamID) {
      alert('❌ لا يمكن التحديث: لا يوجد ID للفحص');
      return;
    }

    if (this.examForm.invalid) {
      alert('❌ يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const updatedExam: SurgicalExam = {
      ...this.exam,
      ...this.examForm.value,
      resultID: Number(this.examForm.value.resultID) 
    };

    const examID: number = updatedExam.surgicalExamID!;

    this.examService.updateSurgicalExam(examID, updatedExam).subscribe({
      next: (res) => {
        alert('✅ تم التحديث بنجاح');
        // تحديث الكائن المحلي للعرض فورًا
        this.exam.result = this.results.find(r => r.resultID === updatedExam.resultID);
        this.exam.resultID = updatedExam.resultID; 
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