import { ApplicantModel } from "../../reception/models/applicant.model";

export interface ArchiveModel {
  archiveID: number;
  applicantID: number;
  decisionID: number;
  fileNumber: string;
  applicantFileNumber: string;
  archiveDate: string;
  digitalCopy: string;
  applicant: ApplicantModel;
}
