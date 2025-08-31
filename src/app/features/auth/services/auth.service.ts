import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { LoginResponse } from '../../../core/models/auth.dto';
import { JWTPayload } from '../../../core/models/jwt-payload.model';
import { UserRoles } from '../../../core/models/enums/user-roles.enum';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 

  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly SPECIALTY_KEY = 'doctor_specialty'; 
  private readonly DOCTOR_ID_KEY = 'doctorId';

  constructor(private http: HttpClient) { }

  // login(userDto: any): Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, userDto).pipe(
  //     tap(response => {
  //       if (response?.data?.accessToken) {
  //         this.setToken(response.data.accessToken, response.data.refreshToken);
  //       }
  //     })
  //   );
  // }
login(userDto: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, userDto).pipe(
      tap(response => {
        if (response?.data?.accessToken) {
          this.setToken(response.data.accessToken, response.data.refreshToken);

          const role = this.getUserRole();

          // ✅ خزن التخصص إذا كان دكتور
          if (role === UserRoles.Doctor && response.data.doctor?.specializationID) {
            localStorage.setItem(
              this.SPECIALTY_KEY,
              response.data.doctor.specializationID.toString(),
            );
          }

          // ✅ خزن معرف الطبيب (doctorID) إذا كان دكتور
          if (role === UserRoles.Doctor && response.data.doctor?.doctorID) {
            localStorage.setItem(
              this.DOCTOR_ID_KEY,
              response.data.doctor.doctorID.toString(),
            );
          }
        }
      })
    );
  }



  getDoctorId(): number | null {
  const doctorId = localStorage.getItem(this.DOCTOR_ID_KEY);
  return doctorId ? +doctorId : null;
}

getSpecializationId(): number | null {
  const specId = localStorage.getItem(this.SPECIALTY_KEY);
  return specId ? +specId : null;
}



 // services/auth.service.ts
getSpecializationNameById(id: number): Observable<string> {
  return this.http
    .get<any>(`${environment.apiUrl}/api/Specializations?page=1&pageSize=100`)
    .pipe(
      // فلترة حسب الـ specializationID
      map((res) => {
        const item = res.data.items.find((s: any) => s.specializationID === id);
        return item ? item.description : 'unknown';
      })
    );
}


private setToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_KEY, refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

   logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  getDecodedToken(): JWTPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const payload = this.getDecodedToken();
    if (!payload) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp ? payload.exp > now : false;
  }

  isAuthorizated(roles: UserRoles[]): boolean {
    const payload = this.getDecodedToken();
    if (!payload) return false;

    const roleClaim = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return roles.includes(roleClaim as UserRoles);
  }

getUserRole(): string | null {
  const payload = this.getDecodedToken();
  return payload ? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
}

getUserId(): string | null {
  const payload = this.getDecodedToken();
  return payload ? payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] : null;
}

getUserName(): string | null {
  const payload = this.getDecodedToken();
  return payload ? payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] : null;
}

 // ✅ دوال خاصة بالتخصص
  setDoctorSpecialty(specialty: string): void {
    localStorage.setItem(this.SPECIALTY_KEY, specialty);
  }

  getDoctorSpecialty(): string | null {
    return localStorage.getItem(this.SPECIALTY_KEY);
  }
}
