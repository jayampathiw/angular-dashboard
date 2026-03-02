import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { Role } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jest.Mocked<Pick<Router, 'navigate'>>;

  beforeEach(() => {
    localStorage.clear();
    routerSpy = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  describe('login', () => {
    it('should authenticate with valid credentials', async () => {
      const response = await firstValueFrom(
        service.login({ email: 'admin@demo.com', password: 'password' }),
      );

      expect(response.user.email).toBe('admin@demo.com');
      expect(response.user.role).toBe(Role.Admin);
      expect(response.accessToken).toBeTruthy();
      expect(response.refreshToken).toBeTruthy();
    });

    it('should set currentUser after login', async () => {
      await firstValueFrom(
        service.login({ email: 'admin@demo.com', password: 'password' }),
      );

      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()?.email).toBe('admin@demo.com');
    });

    it('should persist session to localStorage', async () => {
      await firstValueFrom(
        service.login({ email: 'admin@demo.com', password: 'password' }),
      );

      expect(localStorage.getItem('access_token')).toBeTruthy();
      expect(localStorage.getItem('refresh_token')).toBeTruthy();
      expect(localStorage.getItem('current_user')).toBeTruthy();
    });

    it('should reject invalid credentials', async () => {
      await expect(
        firstValueFrom(
          service.login({ email: 'wrong@email.com', password: 'wrong' }),
        ),
      ).rejects.toThrow('Invalid email or password');
    });

    it('should reject wrong password', async () => {
      await expect(
        firstValueFrom(
          service.login({ email: 'admin@demo.com', password: 'wrong' }),
        ),
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const response = await firstValueFrom(
        service.register({
          email: 'new@user.com',
          password: 'pass123',
          firstName: 'New',
          lastName: 'User',
        }),
      );

      expect(response.user.email).toBe('new@user.com');
      expect(response.user.firstName).toBe('New');
      expect(response.user.role).toBe(Role.Viewer);
    });

    it('should authenticate after registration', async () => {
      await firstValueFrom(
        service.register({
          email: 'new@user.com',
          password: 'pass123',
          firstName: 'New',
          lastName: 'User',
        }),
      );

      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('logout', () => {
    it('should clear session and navigate to login', async () => {
      await firstValueFrom(
        service.login({ email: 'admin@demo.com', password: 'password' }),
      );

      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('getAccessToken', () => {
    it('should return null when not authenticated', () => {
      expect(service.getAccessToken()).toBeNull();
    });

    it('should return token after login', async () => {
      await firstValueFrom(
        service.login({ email: 'admin@demo.com', password: 'password' }),
      );

      expect(service.getAccessToken()).toBeTruthy();
    });
  });

  describe('session restoration', () => {
    it('should restore user from localStorage on init', () => {
      const user = {
        id: 'usr-001',
        email: 'admin@demo.com',
        firstName: 'Admin',
        lastName: 'User',
        role: Role.Admin,
      };

      localStorage.setItem('access_token', 'fake-token');
      localStorage.setItem('current_user', JSON.stringify(user));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: Router, useValue: routerSpy }],
      });

      const restoredService = TestBed.inject(AuthService);
      expect(restoredService.isAuthenticated()).toBe(true);
      expect(restoredService.currentUser()?.email).toBe('admin@demo.com');
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('access_token', 'fake-token');
      localStorage.setItem('current_user', 'invalid-json');

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: Router, useValue: routerSpy }],
      });

      const restoredService = TestBed.inject(AuthService);
      expect(restoredService.isAuthenticated()).toBe(false);
      expect(localStorage.getItem('access_token')).toBeNull();
    });
  });
});
