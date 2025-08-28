import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { JWTPayload } from '../../models/jwt-payload.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {
 @Output() toggleSidebar = new EventEmitter<void>();
 userRole: string | null = null;
showUserMenu = false;
   constructor(private auth: AuthService, private router: Router) {
    this.userRole = this.auth.getUserRole();
  }

  
  onToggleSidebar() {
    this.toggleSidebar.emit();
  }


   logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
