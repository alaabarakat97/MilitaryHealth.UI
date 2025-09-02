import { Component, OnInit } from '@angular/core';
import { Consultation } from '../../../models/consultation.model';
import { InternalExamService } from '../../../services/internal-exam.service';
import { EditConsultation } from '../../Consultations/edit-consultation/edit-consultation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-internal-consultations-list',
  imports: [CommonModule,ButtonModule, FormsModule, EditConsultation],
  templateUrl: './internal-consultations-list.html',
  styleUrl: './internal-consultations-list.scss'
})
export class InternalConsultationsList implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  loading = false;
  searchText = '';

  constructor(
    private service: InternalExamService,
    private toastr: ToastrService // ✅ toastr
  ) {}

  ngOnInit() { this.loadConsultations(); }

  loadConsultations() {
    this.loading = true;
    this.service.getInternalConsultations().subscribe({
      next: res => {
        this.consultations = res;
        this.filteredConsultations = [...res];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('❌ فشل جلب الاستشارات', 'خطأ');
        this.loading = false;
      }
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
    if (!attachment) {
      this.toastr.warning('⚠️ لا يوجد ملف مرفق', 'تنبيه');
      return;
    }
    const url = `${environment.apiUrl}/${attachment}`;
    window.open(url, '_blank');
  }
}
