import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import {  RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule , RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit  {
 @Input() collapsed = false; 
 role: string | null = '';
 
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // نفترض أن AuthService يعطينا الدور من الـ JWT
    this.role = this.authService.getUserRole();
  }
}
