import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { Investigation } from '../../../models/investigation.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditInvestigation } from '../../Investigations/edit-investigation/edit-investigation';

@Component({
  selector: 'app-eye-investigations-list',
  imports: [CommonModule, FormsModule,EditInvestigation],
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

  constructor(private service: EyeExamService) {}

  ngOnInit() { this.loadInvestigations(); }

  loadInvestigations() {
    this.loading = true;
    this.service.getEyeClinicInvestigations().subscribe({
      next: res => { this.investigations = res; this.filteredInvestigations = [...res]; this.loading = false; },
      error: err => { console.error(err); this.loading = false; }
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

  openEditDialog(inv: Investigation) { this.selectedInvestigation = { ...inv }; }

  onDialogClose(updated: boolean) {
    this.selectedInvestigation = null;
    if (updated) this.loadInvestigations();
  }

  openFile(attachment: string) {
    if (!attachment) return;
    window.open(`${environment.apiUrl}/${attachment}`, '_blank');
  }
}