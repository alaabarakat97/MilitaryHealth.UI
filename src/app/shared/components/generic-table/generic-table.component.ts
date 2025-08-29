import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ColumnDef } from '../../models/column-def.model';
import { ToolbarModule } from 'primeng/toolbar';
interface ItemWithId {
  id: string | number;
  [key: string]: any;
}
@Component({
  selector: 'app-generic-table',
  imports: [TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    ToastModule,
    ToolbarModule,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent<T> implements OnInit {
  @Input() data: ItemWithId[] = [];
  @Input() rows: number = 10;
  loading: boolean = true;
  globalFilterFields: string[] = [];
  @Input() columns: ColumnDef[] = [];
  @Input() isPaginator: boolean = true;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50];
  @Input() dataKey = 'id';
  @Input() title = '';
  @Input() isToolbar = true;

  selectedRows: any[] = [];
  filterValue: string = '';


  ngOnInit() {
    this.globalFilterFields = this.columns.map((col) => col.field);
  }

  clear(table: any) {
    table.clear();
    this.filterValue = '';
  }

  onGlobalFilter(table: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  onEdit(row: any) {
    console.log('Edit', row);
  }

  onDelete(row: any) {
    console.log('Delete', row);
  }

}
