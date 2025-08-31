import { Component } from '@angular/core';
import { ApplicantService } from '../../reception/services/applicant.service';
import { ApplicantsStatisticsResponse } from '../../reception/models/applicants-statistics-response.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  total = 0;
  accepted = 0;
  rejected = 0;
  pending = 0;

  loading = true;

  constructor(private applicantService: ApplicantService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics() {
    this.applicantService.getStatistics().subscribe({
      next: (res: ApplicantsStatisticsResponse) => {
        if (res.succeeded) {
          this.total = res.data.total;
          this.accepted = res.data.accepted;
          this.rejected = res.data.rejected;
          this.pending = res.data.pending;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching statistics', err);
        this.loading = false;
      }
    });
  }
}
