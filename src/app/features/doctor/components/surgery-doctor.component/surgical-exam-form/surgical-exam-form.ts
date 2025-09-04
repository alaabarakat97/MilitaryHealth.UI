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
  loading: boolean = false;
  showModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private examService: SurgicalExamService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.examForm = this.fb.group({
      generalSurgery: ['سليم', Validators.required],
      urinarySurgery: ['سليم', Validators.required],
      vascularSurgery: ['سليم', Validators.required],
      thoracicSurgery: ['سليم', Validators.required],
      resultID: [null, Validators.required],
      reason: ['']
    });

    this.examService.getResults().subscribe(res => this.results = res.data?.items || res);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
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
      doctorID,
      generalSurgery: this.examForm.value.generalSurgery,
      urinarySurgery: this.examForm.value.urinarySurgery,
      vascularSurgery: this.examForm.value.vascularSurgery,
      thoracicSurgery: this.examForm.value.thoracicSurgery,
      resultID: Number(this.examForm.value.resultID),
      reason: this.examForm.value.reason || ''
    };

    this.loading = true;
    this.examService.addSurgicalExam(exam).subscribe({
      next: () => {
        this.toastr.success('✅ تمت إضافة الفحص الجراحي بنجاح');
        this.examForm.reset();
        this.loading = false;
        this.closeModal();
      },
      error: (err: any) => {
        this.loading = false;
        if (err?.error?.errors?.detail?.includes('Applicant already registered before')) {
          this.toastr.warning('⚠️ هذا المريض مسجّل مسبقًا. لا يمكن إضافة فحص جديد لنفس الرقم.');
        } else {
          this.toastr.error('❌ حدث خطأ أثناء إضافة الفحص الجراحي');
        }
      }
    });
  }
}