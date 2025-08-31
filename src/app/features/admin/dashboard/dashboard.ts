import { Component } from '@angular/core';
import { SearchApplicantComponent } from '../../applicants/components/search-applican/search-applicant.component.ts/search-applicant.component';

@Component({
  selector: 'app-dashboard',
  imports: [SearchApplicantComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
