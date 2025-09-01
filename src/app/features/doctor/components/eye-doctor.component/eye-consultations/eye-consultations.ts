import { environment } from './../../../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Consultation } from '../../../models/consultation.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditConsultation } from '../../Consultations/edit-consultation/edit-consultation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eye-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, EditConsultation],
  templateUrl: './eye-consultations.html',
  styleUrls: ['./eye-consultations.scss']
})
export class EyeConsultations implements OnInit {
  consultations: Consultation[] = [];
  filteredConsultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  loading: boolean = false;
  searchText: string = '';
  environment = environment;  

  constructor(
    private service: EyeExamService,
    private toastr: ToastrService // ✅ أضفنا Toastr
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations() {
    this.loading = true;
    this.service.getEyeClinicConsultations().subscribe({
      next: (res) => {
        this.consultations = res;
        this.filteredConsultations = [...this.consultations];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('❌ خطأ في جلب الاستشارات', 'خطأ');
        this.loading = false;
      }
    });
  }

  openFile(attachment: string) {
    if (!attachment) {
      this.toastr.warning('⚠️ لا يوجد ملف مرفق', 'تنبيه');
      return;
    }
    const url = `${environment.apiUrl}/${attachment}`;
    window.open(url, '_blank');
  }

  filterConsultations() {
    const search = this.searchText.trim().toLowerCase();
    this.filteredConsultations = !search
      ? [...this.consultations]
      : this.consultations.filter(c =>
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
    if (updated) {
      this.toastr.success('✅ تم تحديث الاستشارة بنجاح', 'نجاح');
      this.loadConsultations();
    }
  }
}
