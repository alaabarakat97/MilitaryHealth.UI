import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/services/auth.service';
import { OrthopedicExam } from '../../../models/orthopedic-exam.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orthopedic-exam-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './orthopedic-exam-form.component.html',
  styleUrls: ['./orthopedic-exam-form.component.scss']
})
export class OrthopedicExamFormComponent {
  @Input() applicantFileNumber: string = '';
  examForm!: FormGroup;

  results: any[] = [];

  constructor(
    private fb: FormBuilder,
    private examService: OrthopedicExamService,
    private authService: AuthService,
    private toastr: ToastrService
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
      this.toastr.error('❌ لم يتم العثور على معرف الطبيب');
      return;
    }

    const exam: OrthopedicExam = {
      applicantFileNumber: this.applicantFileNumber,
      doctorID: doctorID,
      musculoskeletal: this.examForm.value.musculoskeletal,
      neurologicalSurgery: this.examForm.value.neurologicalSurgery,
      resultID: Number(this.examForm.value.resultID),
      reason: this.examForm.value.reason || ''
    };

    this.examService.addOrthopedicExam(exam).subscribe({
      next: () => {
        this.toastr.success('✅ تمت إضافة فحص العظام بنجاح');
        this.examForm.reset();
      },
      error: (err: any) => {
        if (err?.error) {
          this.toastr.error(JSON.stringify(err.error));
        } else {
          this.toastr.error('حدث خطأ أثناء إضافة فحص العظام');
        }
      }
    });
  }
}
