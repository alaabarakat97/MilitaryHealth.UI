import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../../../core/models/user.dto';
import { Observable, tap } from 'rxjs';
import { LoginResponse } from '../../../core/models/auth.dto';
import { JWTPayload } from '../../../core/models/jwt-payload.model';
import { jwtDecode } from 'jwt-decode';
import { UserRoles } from '../../../core/models/enums/user-roles.enum';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    url = 'http://localhost:5120';
  constructor(private http: HttpClient) { }

    login(userDto: UserDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url + '/api/Auth/login', userDto).pipe(
      tap(response => {
        if (response   && response.token ) {
          this.setToken(response.token);
        }
      })
    );
  }

    setToken(token: string) {
    localStorage.removeItem("token");
    localStorage.setItem("token", token);
  }

    getToken(): string | null {
    return localStorage.getItem("token");
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
    return payload.exp ? payload.exp > now : true;
  }

  isAuthorizated(roles: UserRoles[]): boolean {
    const payload = this.getDecodedToken();
    if (!payload) return false;
    return roles.includes(payload.role as UserRoles);
  }
  getUserRole(){
    return "Reception";
  }
}
