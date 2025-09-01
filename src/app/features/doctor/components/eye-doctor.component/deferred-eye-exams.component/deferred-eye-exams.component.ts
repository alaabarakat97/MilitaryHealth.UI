import { Component } from '@angular/core';
import { EyeExam } from '../../../models/eye-exam-post.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditSurgicalExam } from '../../surgery-doctor.component/edit-surgical-exam/edit-surgical-exam';
import { EditEyeExam } from '../edit-eye-exam/edit-eye-exam';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deferred-eye-exams.component',
  imports: [CommonModule, ButtonModule, FormsModule,EditEyeExam],
  templateUrl: './deferred-eye-exams.component.html',
  styleUrl: './deferred-eye-exams.component.scss'
})
export class DeferredEyeExamsComponent {
exams: EyeExam[] = [];
  filteredExams: EyeExam[] = [];
  loading = true;
  selectedExam: EyeExam | null = null;
  searchTerm: string = '';

  // 👇 خصائص التقليب
  page = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(
    private examService: EyeExamService,
    private toastr: ToastrService // ✅ أضفنا ToastrService
  ) {}

  ngOnInit(): void {
    this.loadEyeExams();
  }

  loadEyeExams() {
    this.loading = true;
    this.examService.getAllEyeExams(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.exams = data;
        this.filteredExams = [...this.exams];
        this.totalItems =
          data.length < this.pageSize
            ? this.page * this.pageSize
            : (this.page + 1) * this.pageSize;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('فشل في جلب بيانات فحوصات العيون', 'خطأ');
        this.loading = false;
      }
    });
  }

  changePage(newPage: number) {
    if (newPage < 1) return;
    this.page = newPage;
    this.loadEyeExams();
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredExams = [...this.exams];
      return;
    }

    this.filteredExams = this.exams.filter(
      exam =>
        exam.applicantFileNumber?.toLowerCase().includes(term) ||
        exam.vision?.toLowerCase().includes(term) ||
        exam.colorTest?.toLowerCase().includes(term) ||
        exam.refractionType?.description?.toLowerCase().includes(term) ||
        exam.refractionValue?.toString().includes(term) ||
        exam.otherDiseases?.toLowerCase().includes(term) ||
        exam.reason?.toLowerCase().includes(term) ||
        exam.result?.description?.toLowerCase().includes(term)
    );

    if (this.filteredExams.length === 0) {
      this.toastr.info('لا توجد نتائج مطابقة للبحث', 'معلومة');
    }
  }

  openEditDialog(exam: EyeExam) {
    this.selectedExam = { ...exam };
  }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) {
      this.toastr.success('تم تحديث الفحص بنجاح', 'نجاح');
      this.loadEyeExams();
    }
  }
}