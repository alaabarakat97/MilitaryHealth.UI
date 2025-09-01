import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditConsultation } from '../../Consultations/edit-consultation/edit-consultation';
import { Consultation } from '../../../models/consultation.model';
import { SurgicalExamService } from '../../../services/surgical-exam.service';

@Component({
  selector: 'app-surgery-consultations-list',
  imports: [CommonModule, FormsModule, EditConsultation],
  templateUrl: './surgery-consultations-list.html',
  styleUrl: './surgery-consultations-list.scss'
})
export class SurgeryConsultationsList implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  loading = false;
  searchText = '';

  constructor(private service: SurgicalExamService) {}

  ngOnInit() { this.loadConsultations(); }

  loadConsultations() {
    this.loading = true;
    this.service.getSurgicalConsultations().subscribe({
      next: res => { 
        this.consultations = res; 
        this.filteredConsultations = [...res]; 
        this.loading = false; 
      },
      error: err => { console.error(err); this.loading = false; }
    });
  }

  filterConsultations() {
    const search = this.searchText.trim().toLowerCase();
    this.filteredConsultations = !search ? [...this.consultations] :
      this.consultations.filter(c =>
        c.applicantFileNumber.toLowerCase().includes(search) ||
        c.consultationType.toLowerCase().includes(search) ||
        c.referredDoctor.toLowerCase().includes(search) ||
        c.result.toLowerCase().includes(search) ||
        (c.doctor?.fullName?.toLowerCase().includes(search) ?? false)
      );
  }

  openEditDialog(c: Consultation) { this.selectedConsultation = { ...c }; }

  onDialogClose(updated: boolean) {
    this.selectedConsultation = null;
    if (updated) this.loadConsultations();
  }

  openFile(attachment: string) {
    if (!attachment) return;
    window.open(`${this.service.uploadUrl}/${attachment}`, '_blank');
  }
}