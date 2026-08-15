import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
}

interface LoginResponse {
  token: string;
  user: PublicUser;
}

interface RegisterResponse {
  user: PublicUser;
}

const TOKEN_KEY = "control_gastos_token";
const USER_KEY = "control_gastos_user";
const API_URL = "http://localhost:3000";

@Injectable({ providedIn: "root" })
export class AuthService {
  currentUser = signal<PublicUser | null>(this.readStoredUser());

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
          this.currentUser.set(response.user);
        })
      );
  }

  register(name: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private readStoredUser(): PublicUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
