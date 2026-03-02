import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { delay, Observable, of, tap, throwError } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Role,
  User,
} from '../models/auth.model';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'current_user',
} as const;

const DEMO_USER: User = {
  id: 'usr-001',
  email: 'admin@demo.com',
  firstName: 'Admin',
  lastName: 'User',
  role: Role.Admin,
};

const DEMO_PASSWORD = 'password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  accessToken: string | null = null;

  constructor() {
    this.loadStoredSession();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (
      credentials.email !== DEMO_USER.email ||
      credentials.password !== DEMO_PASSWORD
    ) {
      return throwError(() => new Error('Invalid email or password'));
    }

    const response = this.buildAuthResponse(DEMO_USER);

    return of(response).pipe(
      delay(800),
      tap((res) => this.storeSession(res)),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: Role.Viewer,
    };

    const response = this.buildAuthResponse(newUser);

    return of(response).pipe(
      delay(800),
      tap((res) => this.storeSession(res)),
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
    return this.accessToken;
  }

  private loadStoredSession(): void {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const stored = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && stored) {
      try {
        this.currentUser.set(JSON.parse(stored) as User);
      } catch {
        this.clearStorage();
      }
    }
  }

  private storeSession(response: AuthResponse): void {
    this.currentUser.set(response.user);
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
  }

  private buildAuthResponse(user: User): AuthResponse {
    return {
      user,
      accessToken: btoa(JSON.stringify({ sub: user.id, email: user.email })),
      refreshToken: btoa(JSON.stringify({ sub: user.id, type: 'refresh' })),
    };
  }

  private clearStorage(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}
