import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SurgicalExam } from '../../../models/surgical-exam-post.model';
import { EditSurgicalExam } from '../edit-surgical-exam/edit-surgical-exam';
import { SurgicalExamService } from '../../../services/surgical-exam.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deferred-surgical-exams',
  standalone: true,
  imports: [CommonModule, ButtonModule, EditSurgicalExam, FormsModule],
  templateUrl: './deferred-surgical-exams.component.html',
  styleUrls: ['./deferred-surgical-exams.component.scss']
})
export class DeferredSurgicalExamsComponent implements OnInit {
  exams: SurgicalExam[] = [];          // جميع الفحوصات المؤجلة
  filteredExams: SurgicalExam[] = [];  // نسخة للتصفية والبحث
  loading = true;
  selectedExam: SurgicalExam | null = null;
  searchTerm: string = '';          

  constructor(private examService: SurgicalExamService) {}

  ngOnInit(): void {
    this.loadDeferredExams();
  }

  loadDeferredExams() {
    this.loading = true;
    this.examService.getDeferredSurgicalExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.filteredExams = [...this.exams];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching deferred exams', err);
        this.loading = false;
      }
    });
  }

  openEditDialog(exam: SurgicalExam) {
    this.selectedExam = { ...exam };
  }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) {
      this.loadDeferredExams();
    }
  }

  // 🔹 دالة البحث على الفرونت مباشرة
  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredExams = [...this.exams];
    } else {
      this.filteredExams = this.exams.filter(exam =>
        exam.applicantFileNumber.toLowerCase().includes(term)
      );
    }
  }
}
