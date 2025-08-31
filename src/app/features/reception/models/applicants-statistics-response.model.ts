export interface ApplicantsStatisticsResponse {
  succeeded: boolean;
  status: number;
  message: string;
  data: {
    total: number;
    accepted: number;
    rejected: number;
    pending: number;
  };
}