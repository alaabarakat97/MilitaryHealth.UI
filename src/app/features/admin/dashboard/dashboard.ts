import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ApplicantModel } from '../../reception/models/applicant.model';
import { ApplicantService } from '../../reception/services/applicant.service';
import { PagedResponse } from '../../../shared/models/paged-response.model';
@Component({
  selector: 'app-dashboard',
  imports: [ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit{
applicants: ApplicantModel[] = [];

  // Charts
  maritalChartData: any;
  maritalChartOptions: any;
  tattooChartData: any;
  tattooChartOptions: any;

  // Counters
  totalApplicants = 0;
  todayApplicants = 0;
  monthApplicants = 0;

  constructor(private applicantService: ApplicantService) {}

  ngOnInit(): void {
    this.loadApplicants();
  }

  loadApplicants() {
    this.applicantService.getApplicants$(1, 1000).subscribe({ // نجيب كل البيانات لتصفية الإحصائيات
      next: (res: PagedResponse<ApplicantModel>) => {
        this.applicants = res.items;

        this.totalApplicants = this.applicants.length;

        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // this.todayApplicants = this.applicants.filter(a => new Date(a.createdAt) >= startOfToday).length;
        // this.monthApplicants = this.applicants.filter(a => new Date(a.createdAt) >= startOfMonth).length;

        // جهز بيانات Charts
        this.prepareCharts();
      }
    });
  }

  prepareCharts() {
    const marriedCount = this.applicants.filter(a => a.maritalStatusID === 2).length;
    const singleCount = this.applicants.filter(a => a.maritalStatusID === 4).length;
    const tattooCount = this.applicants.filter(a => a.tattoo).length;
    const noTattooCount = this.applicants.length - tattooCount;

    this.maritalChartData = {
      labels: ['متزوج', 'أعزب'],
      datasets: [{
        data: [marriedCount, singleCount],
        backgroundColor: ['#42A5F5', '#66BB6A'],
        borderWidth: 2
      }]
    };

    this.maritalChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '30%',
      plugins: {
        legend: { position: 'bottom' }
      }
    };

    this.tattooChartData = {
      labels: ['مع وشم', 'بدون وشم'],
      datasets: [{
        data: [tattooCount, noTattooCount],
        backgroundColor: ['#FFA726', '#26A69A'],
        borderWidth: 2
      }]
    };

    this.tattooChartOptions = { ...this.maritalChartOptions };
  }
}
