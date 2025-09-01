import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Investigation } from '../../../models/investigation.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditInvestigation } from '../../Investigations/edit-investigation/edit-investigation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-eye-investigations-list',
  imports: [CommonModule, FormsModule, EditInvestigation],
  templateUrl: './eye-investigations-list.html',
  styleUrl: './eye-investigations-list.scss'
})
export class EyeInvestigationsList implements OnInit {
  investigations: Investigation[] = [];
  filteredInvestigations: Investigation[] = [];
  selectedInvestigation: Investigation | null = null;
  loading = false;
  searchText = '';
  environment = environment;

  constructor(
    private service: EyeExamService,
    private toastr: ToastrService // ✅ أضفنا toastr
  ) {}

  ngOnInit() {
    this.loadInvestigations();
  }

  loadInvestigations() {
    this.loading = true;
    this.service.getEyeClinicInvestigations().subscribe({
      next: (res) => {
        this.investigations = res;
        this.filteredInvestigations = [...res];
        this.loading = false;
      },
      error: () => {
        this.toastr.error('❌ فشل في جلب التحاليل', 'خطأ');
        this.loading = false;
      }
    });
  }

  filterInvestigations() {
    const search = this.searchText.trim().toLowerCase();
    this.filteredInvestigations = !search
      ? [...this.investigations]
      : this.investigations.filter(i =>
          i.applicantFileNumber.toLowerCase().includes(search) ||
          i.type.toLowerCase().includes(search) ||
          i.result.toLowerCase().includes(search) ||
          i.status.toLowerCase().includes(search) ||
          (i.doctor?.fullName?.toLowerCase().includes(search) ?? false)
        );

    if (this.filteredInvestigations.length === 0 && search) {
      this.toastr.info('⚠️ لا توجد نتائج مطابقة للبحث', 'معلومة');
    }
  }

  openEditDialog(inv: Investigation) {
    this.selectedInvestigation = { ...inv };
  }

  onDialogClose(updated: boolean) {
    this.selectedInvestigation = null;
    if (updated) {
      this.toastr.success('✅ تم تحديث التحليل بنجاح', 'نجاح');
      this.loadInvestigations();
    }
  }

  openFile(attachment: string) {
    if (!attachment) {
      this.toastr.warning('⚠️ لا يوجد ملف مرفق', 'تنبيه');
      return;
    }
    window.open(`${environment.apiUrl}/${attachment}`, '_blank');
  }
}
