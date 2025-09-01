import { Component } from '@angular/core';
import { InternalExam } from '../../../models/internal-exam.model';
import { InternalExamService } from '../../../services/internal-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditInternalExamComponent } from '../edit-internal-exam-component/edit-internal-exam-component';

@Component({
  selector: 'app-deferred-internal-exams.component',
  imports: [CommonModule, ButtonModule, FormsModule, EditInternalExamComponent],
  templateUrl: './deferred-internal-exams.component.html',
  styleUrl: './deferred-internal-exams.component.scss'
})
export class DeferredInternalExamsComponent {
exams: InternalExam[] = [];
  filteredExams: InternalExam[] = [];
  loading = true;
  selectedExam: InternalExam | null = null;
  searchTerm: string = '';

  // 👇 خصائص التقليب
  page = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private examService: InternalExamService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams() {
    this.loading = true;
    this.examService.getAllInternalExams(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.exams = data;
        this.filteredExams = [...this.exams];

        // مؤقت: يمكن تعديل totalItems حسب ما يرجعه السيرفر
        this.totalItems = this.page * this.pageSize; 
        this.loading = false;
      },
      error: (err) => { 
        console.error(err); 
        this.loading = false; 
      }
    });
  }

  changePage(newPage: number) {
    if (newPage < 1) return;
    this.page = newPage;
    this.loadExams();
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredExams = [...this.exams];
      return;
    }

    this.filteredExams = this.exams.filter(exam =>
      exam.applicantFileNumber?.toLowerCase().includes(term) ||
      exam.heart?.toLowerCase().includes(term) ||
      exam.respiratory?.toLowerCase().includes(term) ||
      exam.digestive?.toLowerCase().includes(term) ||
      exam.endocrine?.toLowerCase().includes(term) ||
      exam.neurology?.toLowerCase().includes(term) ||
      exam.blood?.toLowerCase().includes(term) ||
      exam.joints?.toLowerCase().includes(term) ||
      exam.kidney?.toLowerCase().includes(term) ||
      exam.hearing?.toLowerCase().includes(term) ||
      exam.skin?.toLowerCase().includes(term) ||
      exam.reason?.toLowerCase().includes(term) ||
      exam.result?.description?.toLowerCase().includes(term)
    );
  }

  openEditDialog(exam: InternalExam) { 
    this.selectedExam = { ...exam }; 
  }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) this.loadExams();
  }
}