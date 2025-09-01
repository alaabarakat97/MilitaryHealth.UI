import { Component, OnInit } from '@angular/core';
import { OrthopedicExam } from '../../../models/orthopedic-exam.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditOrthopedicExamComponent } from '../edit-orthopedic-exam.component/edit-orthopedic-exam.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deferred-orthopedi-exams-component',
  imports: [CommonModule, FormsModule, ButtonModule, EditOrthopedicExamComponent],
  templateUrl: './deferred-orthopedi-exams-component.html',
  styleUrl: './deferred-orthopedi-exams-component.scss'
})
export class DeferredOrthopediExamsComponent implements OnInit {
  exams: OrthopedicExam[] = [];
  filteredExams: OrthopedicExam[] = [];
  loading = true;
  selectedExam: OrthopedicExam | null = null;
  searchTerm: string = '';

  page = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private examService: OrthopedicExamService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(page: number = 1) {
    this.loading = true;
    this.examService.getAllOrthopedicExams(page, this.pageSize).subscribe({
      next: ({ items, totalCount }) => {
        this.exams = items;
        this.filteredExams = [...items];
        this.totalItems = totalCount;
        this.page = page;
        this.loading = false;
      },
      error: err => { 
        this.toastr.error('❌ فشل تحميل الفحوص', 'خطأ');
        this.loading = false; 
      }
    });
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > Math.ceil(this.totalItems / this.pageSize)) return;
    this.loadExams(newPage);
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredExams = [...this.exams];
      return;
    }

    this.filteredExams = this.exams.filter(e =>
      Object.values(e).some(val =>
        val?.toString().toLowerCase().includes(term)
      )
    );
  }

  openEditDialog(exam: OrthopedicExam) {
    this.selectedExam = { ...exam };
  }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) this.loadExams(this.page);
  }
}
