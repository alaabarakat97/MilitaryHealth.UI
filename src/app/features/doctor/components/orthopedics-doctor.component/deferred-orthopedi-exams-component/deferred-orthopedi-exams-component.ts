import { Component, OnInit } from '@angular/core';
import { OrthopedicExam } from '../../../models/orthopedic-exam.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OrthopedicExamFormComponent } from '../orthopedic-exam-form.component/orthopedic-exam-form.component';
import { EditOrthopedicExamComponent } from '../edit-orthopedic-exam.component/edit-orthopedic-exam.component';

@Component({
  selector: 'app-deferred-orthopedi-exams-component',
  imports: [CommonModule, FormsModule, ButtonModule,EditOrthopedicExamComponent],
  templateUrl: './deferred-orthopedi-exams-component.html',
  styleUrl: './deferred-orthopedi-exams-component.scss'
})
export class DeferredOrthopediExamsComponent  implements OnInit {
exams: OrthopedicExam[] = [];
  filteredExams: OrthopedicExam[] = [];
  loading = true;
  selectedExam: OrthopedicExam | null = null;
  searchTerm: string = '';

  constructor(private examService: OrthopedicExamService) {}

  ngOnInit(): void {
    this.loadDeferredExams();
  }

  loadDeferredExams() {
    this.loading = true;
    this.examService.getDeferredOrthopedicExams().subscribe({
      next: data => {
        this.exams = data;
        this.filteredExams = [...data];
        this.loading = false;
      },
      error: err => {
        console.error('❌ Error fetching deferred orthopedic exams', err);
        this.loading = false;
      }
    });
  }

  openEditDialog(exam: OrthopedicExam) {
    this.selectedExam = { ...exam };
  }

  onDialogClose(updated: boolean) {
    this.selectedExam = null;
    if (updated) this.loadDeferredExams();
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) this.filteredExams = [...this.exams];
    else this.filteredExams = this.exams.filter(e =>
      e.applicantFileNumber.toLowerCase().includes(term)
    );
  }
}