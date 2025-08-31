export interface ApiResponse<T> {
  succeeded: boolean;
  status: number;
  message: string;
  data: T;
  traceId: string;
}
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}