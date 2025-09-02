import { ToastModule } from 'primeng/toast';
import { Component, OnInit } from '@angular/core';
import { Consultation } from '../../../models/consultation.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditConsultation } from '../../Consultations/edit-consultation/edit-consultation';
import { environment } from '../../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-orthopedic-consultations-list',
  standalone: true,
  imports: [CommonModule,ButtonModule, FormsModule, EditConsultation],
  templateUrl: './orthopedic-consultations-list.html',
  styleUrls: ['./orthopedic-consultations-list.scss'] // ✅ صحيح: styleUrls وليس styleUrl
})
export class OrthopedicConsultationsList implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  loading = false;
  searchText = '';

  constructor(private service: OrthopedicExamService,private toastr: ToastrService) {}

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
    if (!attachment) {
      this.toastr.warning('⚠️ لا يوجد ملف مرفق', 'تنبيه');
      return;
    }
    const url = `${environment.apiUrl}/${attachment}`;
    window.open(url, '_blank');
  }
}
