import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit  {
  @Input() collapsed = false; 
  role: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const userRole = this.authService.getUserRole();

    if (userRole === 'Doctor') {
      const specialty = this.authService.getDoctorSpecialty();
      if (specialty) {
        switch (specialty.toLowerCase()) {
          case 'عيون':
          case 'eye':
            this.role = 'Doctor_Eye';
            break;
          case 'باطنة':
          case 'internal':
            this.role = 'Doctor_Internal';
            break;
          case 'عظمية':
          case 'orthopedics':
            this.role = 'Doctor_Orthopedics';
            break;
          case 'جراحة':
          case 'surgery':
            this.role = 'Doctor_Surgery';
            break;
          default:
            this.role = 'Doctor'; 
        }
      } else {
        this.role = 'Doctor';
      }
    } else {
      this.role = userRole;
    }
  }
}
