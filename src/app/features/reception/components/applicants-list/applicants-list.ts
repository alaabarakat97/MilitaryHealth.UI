import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ApplicantModel } from '../../models/applicant.model';
import { ApplicantService } from '../../services/applicant.service';
import { PaginatorComponent } from "../../../../shared/components/paginator/paginator.component";
import { PagedResponse } from '../../../../shared/models/paged-response.model';
import { HighlightPipe } from "../../../../shared/pipes/highlight.pipe";
import { Router } from '@angular/router';
import { UserRoles } from '../../../../core/models/enums/user-roles.enum';

@Component({
  selector: 'app-applicants-list',
  imports: [TableModule, CommonModule, PaginatorComponent, HighlightPipe],
  templateUrl: './applicants-list.html',
  styleUrl: './applicants-list.scss'
})
export class ApplicantsList implements OnInit,AfterViewInit  {
  applicants: ApplicantModel[] = [];
  filteredApplicants: ApplicantModel[] = [];
  globalFilter: string = '';
  
  page = 1;
  rowsPerPage = 10;
  totalRecords = 0;
  loading = false;
 tableHeight = '400px';
  constructor(private applicantService: ApplicantService , private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplicants();
  }

  loadApplicants() {
    this.loading = true;
    const filter = this.globalFilter || '';
    this.applicantService.getApplicants$(this.page, this.rowsPerPage,filter).subscribe({
      next: (res: PagedResponse<ApplicantModel>) => {
        this.applicants = res.items;
        this.filteredApplicants = res.items;
        this.totalRecords = res.totalCount;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

onPageChange(newPage: number) {
  this.page = newPage;
  this.loadApplicants();
}

onPageSizeChange(newSize: number) {
  this.rowsPerPage = newSize;
  this.page = 1;
  this.loadApplicants();
}

onFilterChange(event: Event) {
  const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
  this.globalFilter = value;
  this.page = 1;
  this.loadApplicants();

}
  ngAfterViewInit() {
    this.tableHeight = this.calculateTableHeight(); 
    this.cdr.detectChanges(); 
  }

  calculateTableHeight(): string {
    return window.innerHeight - 200 + 'px'; 
  }
  @HostListener('window:resize')
  onResize() {
    this.setTableHeight();
  }

  setTableHeight() {
    const screenHeight = window.innerHeight;

    const reservedSpace = 220;  

    this.tableHeight = (screenHeight - reservedSpace) + 'px';
  }
  viewApplicant(id: number) {
  this.router.navigate(['reception/applicants/', id]);
}
}
