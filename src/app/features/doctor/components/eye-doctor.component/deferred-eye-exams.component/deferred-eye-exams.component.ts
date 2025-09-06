import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { EyeExam } from '../../../models/eye-exam-post.model';
import { EyeExamService } from '../../../services/eye-exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditSurgicalExam } from '../../surgery-doctor.component/edit-surgical-exam/edit-surgical-exam';
import { EditEyeExam } from '../edit-eye-exam/edit-eye-exam';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { PagedResponse } from '../../../../applicants/models/api-response.model';
import { PaginatorComponent } from "../../../../../shared/components/paginator/paginator.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deferred-eye-exams.component',
  imports: [CommonModule, ButtonModule, FormsModule, EditEyeExam, TableModule, PaginatorComponent],
  templateUrl: './deferred-eye-exams.component.html',
  styleUrl: './deferred-eye-exams.component.scss'
})
export class DeferredEyeExamsComponent {
  exams: EyeExam[] = [];
  filteredExams: EyeExam[] = [];
  globalFilter: string = '';
  page = 1;
  rowsPerPage = 10;
  totalRecords = 0;
  loading = false;


  selectedExam: EyeExam | null = null;
  searchTerm: string = '';
  pageSize = 10;
  totalItems = 0;
  tableHeight = '400px';



  constructor(
    private examService: EyeExamService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.loadEyeExams();
  }

  loadEyeExams() {
    this.loading = true;
    const filter = this.globalFilter || '';
    this.examService.getAllEyeExams(this.page, this.rowsPerPage, filter).subscribe({
      next: (data: PagedResponse<EyeExam>) => {
        this.exams = data.items;
        this.filteredExams = data.items;
        this.totalRecords = data.totalCount;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('فشل في جلب بيانات فحوصات العيون', 'خطأ');
        this.loading = false;
      }
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadEyeExams();
  }
  onPageSizeChange(newSize: number) {
    this.rowsPerPage = newSize;
    this.page = 1;
    this.loadEyeExams();
  }
  onFilterChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.globalFilter = value;
    this.page = 1;
    this.loadEyeExams();

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


  openEditExam(eyeExam: EyeExam) {
    const modalRef = this.modalService.open(EditEyeExam, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    modalRef.componentInstance.exam  = eyeExam;
    modalRef.componentInstance.eyeExamUpdated.subscribe(() => {
      this.loadEyeExams();
    });
  }
  getBadgeClass(result: any): string {
    if (!result || !result.description) {
      return 'badge';
    }
    switch (result.description) {
      case 'مقبول':
        return 'badge bg-success';
      case 'مرفوض':
        return 'badge bg-danger';
      case 'مؤجل':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-secondary';
    }
  }
}