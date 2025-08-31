import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { OrthopedicExam } from '../../../models/orthopedic-exam.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orthopedic-exam-form',
   standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './orthopedic-exam-form.component.html',
  styleUrl: './orthopedic-exam-form.component.scss'
})
export class OrthopedicExamFormComponent {
  @Input() applicantFileNumber: string = '';
  examForm!: FormGroup;

  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: OrthopedicExamService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      musculoskeletal: ['', Validators.required],
      neurologicalSurgery: ['', Validators.required],
      resultID: [null, Validators.required],
      reason: ['']
    });

    this.examService.getResults().subscribe(res => this.results = res.data.items || res);
  }

  onSubmit() {
    if (this.examForm.invalid) return;

    const doctorID = Number(this.authService.getDoctorId());
    if (!doctorID) {
      alert('❌ لم يتم العثور على معرف الطبيب');
      return;
    }

 const exam: OrthopedicExam = {
  applicantFileNumber: this.applicantFileNumber,
  doctorID: Number(doctorID), // تأكد من number
  musculoskeletal: this.examForm.value.musculoskeletal,
  neurologicalSurgery: this.examForm.value.neurologicalSurgery,
  resultID: Number(this.examForm.value.resultID), // تأكد من number
  reason: this.examForm.value.reason || ''
};

    console.log('🚀 Data to send:', exam);

 this.examService.addOrthopedicExam(exam).subscribe({
  next: () => {
    alert('✅ تمت إضافة فحص العظام بنجاح');
    this.examForm.reset();
  },
  error: (err: any) => {
    console.error(' API error:', err);
    if (err?.error) {
      alert(' ' + JSON.stringify(err.error));
    } else {
      alert(' حدث خطأ أثناء إضافة فحص العظام');
    }
  }
});
  }
}