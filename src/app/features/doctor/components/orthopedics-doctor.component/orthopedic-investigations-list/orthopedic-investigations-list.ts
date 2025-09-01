import { Component, OnInit } from '@angular/core';
import { Investigation } from '../../../models/investigation.model';
import { OrthopedicExamService } from '../../../services/orthopedic-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditInvestigation } from '../../Investigations/edit-investigation/edit-investigation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orthopedic-investigations-list',
  imports: [CommonModule, FormsModule, EditInvestigation],
  templateUrl: './orthopedic-investigations-list.html',
  styleUrls: ['./orthopedic-investigations-list.scss']
})
export class OrthopedicInvestigationsList implements OnInit {
  investigations: Investigation[] = [];
  filteredInvestigations: Investigation[] = [];
  selectedInvestigation: Investigation | null = null;
  loading = false;
  searchText = '';

  constructor(
    private service: OrthopedicExamService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadInvestigations();
  }

  loadInvestigations() {
    this.loading = true;
    this.service.getOrthopedicInvestigations().subscribe({
      next: res => { 
        this.investigations = res; 
        this.filteredInvestigations = [...res]; 
        this.loading = false; 
      },
      error: err => { 
        this.toastr.error('حدث خطأ أثناء تحميل الفحوصات'); 
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
    if (!attachment) return;
    window.open(`${this.service.uploadUrl}/${attachment}`, '_blank');
  }
}
