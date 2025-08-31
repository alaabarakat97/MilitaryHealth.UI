import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginatorComponent } from '../../../../shared/components/paginator/paginator.component';
import { Router } from '@angular/router';
import { PagedResponse } from '../../../applicants/models/api-response.model';
import { ArchiveModel } from '../../models/archive.model';
import { ArchiveService } from '../../services/archive';
@Component({
  selector: 'app-archive-list',
  imports: [PaginatorComponent, TableModule, CommonModule],
  templateUrl: './archive-list.html',
  styleUrl: './archive-list.scss'
})
export class ArchiveList {
archives: ArchiveModel[] = [];
  loading = true;
  globalFilter: string = '';

  page = 1;
  rowsPerPage = 10;
  totalRecords = 0;
  tableHeight = '300px';

  constructor(
    private archiveService: ArchiveService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadArchives();
  }

  loadArchives() {
    this.archiveService.getArchives$(this.page, this.rowsPerPage, this.globalFilter)
      .subscribe({
        next: (res: PagedResponse<ArchiveModel>) => {
          this.archives = res.items;
          this.totalRecords = res.totalCount;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching archives', err);
          this.loading = false;
        }
      });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadArchives();
  }

  onPageSizeChange(newSize: number) {
    this.rowsPerPage = newSize;
    this.page = 1;
    this.loadArchives();
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.globalFilter = value;
    this.page = 1;
    this.loadArchives();
  }

  editArchive(archive: ArchiveModel) {
    // ممكن تفتح مودال أو تروح لصفحة تعديل
    this.router.navigate(['/archives/edit', archive.archiveID]);
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
}
