import { Component, OnInit } from '@angular/core';
import { Consultation } from '../../../models/consultation.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditConsultation } from '../../Consultations/edit-consultation/edit-consultation';

@Component({
  selector: 'app-orthopedic-consultations-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EditConsultation],
  templateUrl: './orthopedic-consultations-list.html',
  styleUrls: ['./orthopedic-consultations-list.scss'] // ✅ صحيح: styleUrls وليس styleUrl
})
export class OrthopedicConsultationsList implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  loading = false;
  searchText = '';

  constructor(private service: OrthopedicExamService) {}

  ngOnInit() {
    this.loadConsultations();
  }

  loadConsultations() {
    this.loading = true;
    this.service.getOrthopedicConsultations().subscribe({
      next: (res: Consultation[]) => { 
        this.consultations = res; 
        this.filteredConsultations = [...res]; 
        this.loading = false; 
      },
      error: (err) => { 
        console.error('❌ Error loading consultations:', err); 
        this.loading = false; 
      }
    });
  }

  filterConsultations() {
    const search = this.searchText.trim().toLowerCase();
    if (!search) {
      this.filteredConsultations = [...this.consultations];
      return;
    }

    this.filteredConsultations = this.consultations.filter(c =>
      c.applicantFileNumber.toLowerCase().includes(search) ||
      c.consultationType.toLowerCase().includes(search) ||
      c.referredDoctor.toLowerCase().includes(search) ||
      c.result.toLowerCase().includes(search) ||
      (c.doctor?.fullName?.toLowerCase().includes(search) ?? false)
    );
  }

  openEditDialog(c: Consultation) {
    this.selectedConsultation = { ...c };
  }

  onDialogClose(updated: boolean) {
    this.selectedConsultation = null;
    if (updated) this.loadConsultations();
  }

  openFile(attachment: string) {
    if (!attachment) return;
    window.open(`${this.service.uploadUrl}/${attachment}`, '_blank');
  }
}
