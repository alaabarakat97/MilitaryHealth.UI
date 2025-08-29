import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm!: FormGroup;


  constructor(private authService: AuthService,
    private fb: FormBuilder, private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  loging() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;

    this.authService.login(loginData).subscribe({
      next: () => {
        const role = this.authService.getUserRole();
        if (role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'Reception') {
          this.router.navigate(['/reception/applicants/add']);
        } else if (role === 'Doctor') {
          this.router.navigate(['/doctor']);
        }
        else if (role === 'Supervisor') {
          this.router.navigate(['/supervisor']);
        }
         else {
          this.router.navigate(['/unauthorized']); // fallback لو حابب
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }

  getFieldError(fieldName: string): string | null {
    const control = this.loginForm.get(fieldName);
    if (control && control.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'هذا الحقل مطلوب';
      }
      if (control.errors?.['email']) {
        return 'يرجى إدخال بريد إلكتروني صحيح';
      }
      if (control.errors?.['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `الحد الأدنى ${requiredLength} حروف`;
      }
      if (control.errors?.['maxlength']) {
        const maxLength = control.errors['maxlength'].requiredLength;
        return `الحد الأقصى ${maxLength} حروف`;
      }
      if (control.errors?.['pattern']) {
        return 'القيمة غير مطابقة للنمط المطلوب';
      }
    }
    return null;
  }
}
