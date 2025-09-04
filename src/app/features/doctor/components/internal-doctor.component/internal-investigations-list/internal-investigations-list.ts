import { Component, OnInit } from '@angular/core';
import { Investigation } from '../../../models/investigation.model';
import { InternalExamService } from '../../../services/internal-exam.service';
import { EditInvestigation } from '../../Investigations/edit-investigation/edit-investigation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../../environments/environment';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-internal-investigations-list',
  imports: [CommonModule, ButtonModule,FormsModule, EditInvestigation],
  templateUrl: './internal-investigations-list.html',
  styleUrl: './internal-investigations-list.scss'
})
export class InternalInvestigationsList implements OnInit {
  investigations: Investigation[] = [];
  filteredInvestigations: Investigation[] = [];
  selectedInvestigation: Investigation | null = null;
  loading = false;
  searchText = '';

  constructor(
    private service: InternalExamService,
    private toastr: ToastrService
  ) {}

  ngOnInit() { this.loadInvestigations(); }

  loadInvestigations() {
    this.loading = true;
    this.service.getInternalInvestigations().subscribe({
      next: res => {
        this.investigations = res;
        this.filteredInvestigations = [...res];
        this.loading = false;
      },
      error: err => {
        this.toastr.error('❌ فشل جلب التحاليل', 'خطأ');
        this.loading = false;
      }
    });
  }

  filterInvestigations() {
    const search = this.searchText.trim().toLowerCase();
    this.filteredInvestigations = !search ? [...this.investigations] :
      this.investigations.filter(i =>
        i.applicantFileNumber.toLowerCase().includes(search) ||
        i.type.toLowerCase().includes(search) ||
        i.result.toLowerCase().includes(search) ||
        i.status.toLowerCase().includes(search) ||
        (i.doctor?.fullName?.toLowerCase().includes(search) ?? false)
      );
  }

  openEditDialog(inv: Investigation) {
    this.selectedInvestigation = { ...inv };
  }

  onDialogClose(updated: boolean) {
    this.selectedInvestigation = null;
    if (updated) this.loadInvestigations();
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
