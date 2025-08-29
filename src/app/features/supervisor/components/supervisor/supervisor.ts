import { Component } from '@angular/core';
import { ApplicantModel } from '../../../reception/models/applicant.model';
import { ApplicantService } from '../../../reception/services/applicant.service';
import { CommonModule } from '@angular/common';
import { PagedResponse } from '../../../../shared/models/paged-response.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supervisor',
  imports: [CommonModule,FormsModule],
  templateUrl: './supervisor.html',
  styleUrl: './supervisor.scss'
})
export class Supervisor {
  searchValue: string = '';
  applicant!: ApplicantModel;

constructor(private applicantService: ApplicantService ) {}

  loadApplicants() {
    this.applicantService.getApplicants$(1, 1,this.searchValue).subscribe({
      next: (res: PagedResponse<ApplicantModel>) => {
        this.applicant = res.items[0];
      },
      error: () => {
      }
    });
  }
}
