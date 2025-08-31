import { Component } from '@angular/core';
import { EyeExam } from '../../../models/eye-exam-post.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditSurgicalExam } from '../../surgery-doctor.component/edit-surgical-exam/edit-surgical-exam';
import { EditEyeExam } from '../edit-eye-exam/edit-eye-exam';

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

  constructor(private examService: EyeExamService) {}

  ngOnInit(): void { this.loadDeferredExams(); }

  loadDeferredExams() {
    this.loading = true;
    this.examService.getEyeExams().subscribe({
      next: (data) => {
        this.exams = data;
        this.filteredExams = [...this.exams];
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  openEditDialog(exam: EyeExam) { this.selectedExam = { ...exam }; }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) this.loadDeferredExams();
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredExams = !term
      ? [...this.exams]
      : this.exams.filter(exam => exam.applicantFileNumber.toLowerCase().includes(term));
  }
}