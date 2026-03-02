import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { signal } from '@angular/core';
import { authGuard, guestGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('Auth Guards', () => {
  let authServiceSpy: { isAuthenticated: ReturnType<typeof signal> };
  let routerSpy: { createUrlTree: jest.Mock };

  beforeEach(() => {
    authServiceSpy = { isAuthenticated: signal(false) };
    routerSpy = {
      createUrlTree: jest.fn().mockReturnValue({ toString: () => '/mock' }),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  describe('authGuard', () => {
    it('should allow access when authenticated', () => {
      authServiceSpy.isAuthenticated = signal(true);
      TestBed.overrideProvider(AuthService, {
        useValue: authServiceSpy,
      });

      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as any, {} as any),
      );
      expect(result).toBe(true);
    });

    it('should redirect to login when not authenticated', () => {
      const result = TestBed.runInInjectionContext(() =>
        authGuard({} as any, {} as any),
      );
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
      expect(result).toBeTruthy();
      expect(result).not.toBe(true);
    });
  });

  describe('guestGuard', () => {
    it('should allow access when not authenticated', () => {
      const result = TestBed.runInInjectionContext(() =>
        guestGuard({} as any, {} as any),
      );
      expect(result).toBe(true);
    });

    it('should redirect to dashboard when authenticated', () => {
      authServiceSpy.isAuthenticated = signal(true);
      TestBed.overrideProvider(AuthService, {
        useValue: authServiceSpy,
      });

      const result = TestBed.runInInjectionContext(() =>
        guestGuard({} as any, {} as any),
      );
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
      expect(result).toBeTruthy();
      expect(result).not.toBe(true);
    });
  });
});
