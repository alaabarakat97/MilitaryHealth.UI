import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule,RouterModule],
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
      email: ['', [Validators.required]],
      passWord: ['', [Validators.required]]
    });
  }

    loging() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      console.log(loginData);
      this.authService.login(loginData).subscribe(
        {
          
          next: (data) => {
              const payload = this.authService.getDecodedToken();
      const role = payload?.role || ''; // مثال: افترض role موجود في الـ JWT

      if (role === 'Admin') {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/reception']);
      }
          }
        }
      );
    }
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
