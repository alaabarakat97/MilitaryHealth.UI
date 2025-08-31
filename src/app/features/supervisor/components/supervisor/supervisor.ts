import { Component, OnInit } from '@angular/core';
import { ApplicantDetailsModel, ApplicantModel } from '../../../reception/models/applicant.model';
import { ApplicantService } from '../../../reception/services/applicant.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LookupService } from '../../../../shared/services/lookup.service';
import { Result } from '../../../../shared/models/result.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { DecisionService } from '../../services/decision.service';
import { FinalDecisionModel } from '../../models/final-decision.model';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-supervisor',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './supervisor.html',
  styleUrl: './supervisor.scss'
})
export class Supervisor implements OnInit {
  searchValue: string = '';
  applicant!: ApplicantDetailsModel;
  results: Result[] = [];
  decisionModel!: FinalDecisionModel;

   rejectedId: number | null = null;
  postponedId: number | null = null;

  responseMessage: string = '';
responseSuccess: boolean = false;
  
  isApproved : boolean = true;

  constructor(private applicantService: ApplicantService, private lookupService: LookupService,
    private decisionService: DecisionService , private messageService: MessageService,
  ) { }
  ngOnInit(): void {
    this.loadResults();
  }

  loadApplicants() {
    this.applicantService.getApplicantByFileNumber$(this.searchValue).subscribe({
      next: (applicantDetails: ApplicantDetailsModel) => {
        this.applicant = applicantDetails;
        this.mapApplicantToDecision(applicantDetails); 

      },
      error: () => console.error('Error fetching applicant data')
    });
  }
 loadResults() {
    this.lookupService.getResults().subscribe({
      next: (data) => {
        this.results = data;
console.log(this.results);
        const rejected = this.results.find(r => r.description == 'غير لائق');
        console.log(rejected);
        const postponed = this.results.find(r => r.description == 'مؤجل');
        this.rejectedId = rejected ? rejected.resultID : null;
        this.postponedId = postponed ? postponed.resultID : null;
      },
      error: (err) => console.error('Error fetching results', err)
    });
  }
  private mapApplicantToDecision(applicant: ApplicantDetailsModel) {
  this.decisionModel = {
    orthopedicExamID: applicant.orthopedicExamDto?.orthopedicExamID || 0,
    surgicalExamID: applicant.surgicalExam?.surgicalExamID || 0,
    internalExamID: applicant.internalExam?.internalExamID || 0,
    eyeExamID: applicant.eyeExam?.eyeExamID || 0,
    applicantFileNumber: applicant.fileNumber,
    resultID: 0,
    reason: '', 
    postponeDuration: '', 
    decisionDate: new Date().toISOString().split('T')[0]
  };
}
onResultChange(selectedId: number) {
  if (selectedId === this.rejectedId || selectedId === this.postponedId) {
    this.isApproved = false; 
  } else {
    this.isApproved = true; 
    this.decisionModel.reason = '';
    this.decisionModel.postponeDuration = '';
  }
}

 submitDecision() {
    this.decisionService.createFinalDecision(this.decisionModel)
      .subscribe({
         next: (res) => {
        if (res.succeeded) {
          this.responseMessage = 'تم إرسال القرار بنجاح';
          this.responseSuccess = true;
        } else {
          //const errorMsg = res.errors?.detail?.join(', ') || res.message || 'حدث خطأ غير معروف';
          const errorMsg = "حدث خطأ غير معروف";
          this.responseMessage = errorMsg;
          this.responseSuccess = false;
        }
      },
      error: (err) => {
        const serverMsg = err?.error?.errors?.detail?.join(', ') || err?.error?.message || 'حدث خطأ أثناء الاتصال بالسيرفر';
        this.responseMessage = serverMsg;
        this.responseSuccess = false;
      }
      });
  }
}
