import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { UserDto } from '../../../core/models/user.dto';
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

  constructor(private http: HttpClient) { }

  login(userDto: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, userDto).pipe(
      tap(response => {
        if (response?.data?.accessToken) {
          this.setToken(response.data.accessToken, response.data.refreshToken);
        }
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
}
