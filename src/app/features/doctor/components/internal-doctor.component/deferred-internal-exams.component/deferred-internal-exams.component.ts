import { Component } from '@angular/core';
import { InternalExam } from '../../../models/internal-exam.model';
import { InternalExamService } from '../../../services/internal-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditInternalExamComponent } from '../edit-internal-exam-component/edit-internal-exam-component';

@Component({
  selector: 'app-deferred-internal-exams.component',
  imports: [CommonModule, ButtonModule, FormsModule,EditInternalExamComponent],
  templateUrl: './deferred-internal-exams.component.html',
  styleUrl: './deferred-internal-exams.component.scss'
})
export class DeferredInternalExamsComponent {
 exams: InternalExam[] = [];
  filteredExams: InternalExam[] = [];
  loading = true;
  selectedExam: InternalExam | null = null;
  searchTerm: string = '';

  constructor(private examService: InternalExamService) {}

  ngOnInit(): void {
    this.loadDeferredExams();
  }

  loadDeferredExams() {
    this.loading = true;
    this.examService.getDeferredInternalExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.filteredExams = [...this.exams];
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching deferred internal exams', err);
        this.loading = false;
      }
    });
  }

  openEditDialog(exam: InternalExam) {
    this.selectedExam = { ...exam };
  }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) {
      this.loadDeferredExams();
    }
  }

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