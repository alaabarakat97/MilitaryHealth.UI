import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '../../../../shared/services/lookup.service';
import { Result } from '../../../doctor/models/internal-exam.model';
import { ApplicantDetailsModel } from '../../../reception/models/applicant.model';
import { MaritalStatus } from '../../../reception/models/marital-status.model';
import { ApplicantService } from '../../../reception/services/applicant.service';
import { MaritalStatusService } from '../../../reception/services/marital-status.service';
import { FinalDecisionModel } from '../../../supervisor/models/final-decision.model';
import { DecisionService } from '../../../supervisor/services/decision.service';
import { ArchiveService } from '../../services/archive';
import { DataSharingService } from '../../../../shared/services/data-sharing';
import { ArchiveModel } from '../../models/archive.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-applicant-profile',
  imports: [],
  templateUrl: './applicant-profile.html',
  styleUrl: './applicant-profile.scss'
})
export class ApplicantProfile implements OnInit, OnDestroy {
  applicant!: ApplicantDetailsModel;
  decisionModel!: FinalDecisionModel;
  results: Result[] = [];
  maritalStatuses: MaritalStatus[] = [];
  archive: ArchiveModel | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private applicantService: ApplicantService,
    private lookupService: LookupService,
    private maritalStatusService: MaritalStatusService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.archive = navigation.extras.state['archiveData'];
    }
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  if (history.state.archiveData) {
      this.archive = history.state.archiveData;
      console.log('بيانات الأرشيف التي تم استقبالها:', this.archive);
    } else {
      console.log('لا توجد بيانات متاحة.');
    }
    const fileNumber = this.route.snapshot.paramMap.get('fileNumber')!;
    this.loadApplicant(fileNumber);
    this.loadResults();
    this.loadMaritalStatuses();

  }

  private loadApplicant(fileNumber: string) {
    this.applicantService.getApplicantByFileNumber$(fileNumber).subscribe({
      next: (data) => {
        console.log(data);
        this.applicant = data;
      },
      error: () => {
        console.error('فشل في تحميل بيانات المنتسب');
      }
    });
  }

  private loadResults() {
    this.lookupService.getResults().subscribe({
      next: (data) => (this.results = data),
      error: (err) => console.error('فشل في تحميل النتائج', err)
    });
  }

  private loadMaritalStatuses() {
    this.maritalStatusService.getMaritalStatus().subscribe({
      next: (data) => (this.maritalStatuses = data),
      error: (err) => console.error('فشل في تحميل الحالات الاجتماعية', err)
    });
  }


  getMaritalStatusDescription(id: number): string {
    const status = this.maritalStatuses.find(s => s.maritalStatusID === id);
    return status ? status.description : 'غير محدد';
  }

  getResultDescription(resultID?: number): string {
    if (!resultID) return 'غير محدد';
    const result = this.results.find(r => r.resultID === resultID);
    return result ? result.description : 'غير محدد';
  }

  print() {
    window.print();
  }
}
