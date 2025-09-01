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
 exams: SurgicalExam[] = [];
  filteredExams: SurgicalExam[] = [];
  loading = true;
  selectedExam: SurgicalExam | null = null;
  searchTerm: string = '';

  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private examService: SurgicalExamService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  loadExams(page: number = 1) {
    this.loading = true;
    this.examService.getAllSurgicalExams(page, this.pageSize).subscribe({
      next: ({ items, totalCount }) => {
        this.exams = items;
        this.filteredExams = [...items];
        this.totalItems = totalCount;
        this.page = page;
        this.loading = false;
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.loadExams(newPage);
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredExams = [...this.exams];
    } else {
      this.filteredExams = this.exams.filter(exam =>
        Object.values(exam).some(val => val?.toString().toLowerCase().includes(term))
      );
    }
  }

  openEditDialog(exam: SurgicalExam) {
    this.selectedExam = { ...exam };
  }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) this.loadExams(this.page);
  }
}