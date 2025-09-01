export interface ApiResponse<T> {
  succeeded: boolean;
  status: number;
  message: string;
  data: T;
  errors?: {
    detail?: string[];
    [key: string]: any; 
  };
  traceId?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
