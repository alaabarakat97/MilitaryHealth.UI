export interface ColumnDef {
  field: string;
  header: string;
  filterType?: 'text' | 'dropdown' | 'multiselect' | 'date' | 'checkbox';
  filterOptions?: any[];
  sortable?: boolean;    // هل العمود يدعم الترتيب؟
  filterable?: boolean;  // هل العمود يدعم التصفية؟
}