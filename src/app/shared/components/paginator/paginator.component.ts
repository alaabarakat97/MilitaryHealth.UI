import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() totalRecords = 0;
  @Input() pageSize = 10; 
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageSizes = [5,10, 25, 50, 100];

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }
  get startRecord(): number {
    return this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }
  get endRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }
  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }
  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);

    }
  }

  prevPage(): void {
    if (this.hasPreviousPage) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }
  nextPage(): void {
    if (this.hasNextPage) {
      this.pageChange.emit(this.currentPage + 1);

    }
  }
  changePageSize(event: Event): void {
    const value = +(event.target as HTMLSelectElement).value;
    this.pageSizeChange.emit(value);
  }
}