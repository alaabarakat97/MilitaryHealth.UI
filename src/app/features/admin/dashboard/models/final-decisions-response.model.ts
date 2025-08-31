import { FinalDecision } from "./result.model";

export interface FinalDecisionsResponse {
  succeeded: boolean;
  status: number;
  message: string;
  data: {
    items: FinalDecision[];
    totalCount: number;
    page: number;
    pageSize: number;
  };
}