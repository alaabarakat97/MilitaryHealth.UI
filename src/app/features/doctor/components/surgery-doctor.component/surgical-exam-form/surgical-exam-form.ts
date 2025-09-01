import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { SurgicalExam } from '../../../models/surgical-exam-post.model';
import { SurgicalExamService } from '../../../services/surgical-exam.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-surgical-exam-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './surgical-exam-form.html',
  styleUrls: ['./surgical-exam-form.scss']
})
export class SurgicalExamForm implements OnInit {
  @Input() applicantFileNumber: string = '';
  examForm!: FormGroup;
  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: SurgicalExamService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      generalSurgery: ['', Validators.required],
      urinarySurgery: ['', Validators.required],
      vascularSurgery: ['', Validators.required],
      thoracicSurgery: ['', Validators.required],
      resultID: [null, Validators.required],
      reason: ['']
    });

    this.examService.getResults().subscribe({
      next: res => this.results = res.data.items,
      error: () => this.toastr.error('❌ فشل تحميل النتائج')
    });
  }

  onSubmit() {
    if (this.examForm.invalid) return;

    const doctorID = Number(this.authService.getDoctorId());
    if (!doctorID) {
      this.toastr.error('❌ لم يتم العثور على معرف الطبيب');
      return;
    }

    const exam: SurgicalExam = {
      applicantFileNumber: this.applicantFileNumber,
      doctorID: doctorID,
      generalSurgery: this.examForm.value.generalSurgery,
      urinarySurgery: this.examForm.value.urinarySurgery,
      vascularSurgery: this.examForm.value.vascularSurgery,
      thoracicSurgery: this.examForm.value.thoracicSurgery,
      resultID: Number(this.examForm.value.resultID),
      reason: this.examForm.value.reason || ''
    };

    this.examService.addSurgicalExam(exam).subscribe({
      next: () => {
        this.toastr.success('✅ تمت إضافة الفحص الجراحي بنجاح');
        this.examForm.reset();
      },
      error: (err: any) => {
        if (err?.error?.errors?.detail?.includes('Applicant already registered before')) {
          this.toastr.warning('⚠️ هذا المريض مسجّل مسبقًا. لا يمكن إضافة فحص جديد لنفس الرقم.');
        } else {
          this.toastr.error('❌ حدث خطأ أثناء إضافة الفحص الجراحي');
          this.toastr.warning('⚠️ ربما هذا المريض مسجّل مسبقًا. لا يمكن إضافة فحص جديد لنفس الرقم.');
        }
      }
    });
  }
}
