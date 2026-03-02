import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, delay, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/auth.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authServiceSpy: {
    login: jest.Mock;
    currentUser: ReturnType<typeof signal>;
    isAuthenticated: ReturnType<typeof signal>;
  };
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceSpy = {
      login: jest.fn(),
      currentUser: signal(null),
      isAuthenticated: signal(false),
    };
    routerSpy = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(LoginComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    const fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should not be loading initially', () => {
    expect(component.loading()).toBe(false);
  });

  describe('form validation', () => {
    it('should require email', () => {
      component.form.patchValue({ email: '', password: 'password123' });
      expect(component.form.get('email')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      component.form.patchValue({ email: 'invalid', password: 'password123' });
      expect(component.form.get('email')?.hasError('email')).toBe(true);
    });

    it('should require password', () => {
      component.form.patchValue({ email: 'test@test.com', password: '' });
      expect(component.form.get('password')?.hasError('required')).toBe(true);
    });

    it('should require minimum 6 char password', () => {
      component.form.patchValue({ email: 'test@test.com', password: '123' });
      expect(component.form.get('password')?.hasError('minlength')).toBe(true);
    });

    it('should be valid with correct values', () => {
      component.form.patchValue({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('error messages', () => {
    it('should return email required message', () => {
      component.form.get('email')?.markAsTouched();
      expect(component.getEmailErrorMessage()).toBe('Email is required');
    });

    it('should return email format message', () => {
      component.form.patchValue({ email: 'invalid' });
      component.form.get('email')?.markAsTouched();
      expect(component.getEmailErrorMessage()).toBe(
        'Enter a valid email address',
      );
    });

    it('should return password required message', () => {
      component.form.get('password')?.markAsTouched();
      expect(component.getPasswordErrorMessage()).toBe(
        'Password is required',
      );
    });

    it('should return password minlength message', () => {
      component.form.patchValue({ password: '12' });
      component.form.get('password')?.markAsTouched();
      expect(component.getPasswordErrorMessage()).toBe(
        'Password must be at least 6 characters',
      );
    });
  });

  describe('onSubmit', () => {
    it('should not submit invalid form', () => {
      component.onSubmit();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should mark form as touched on invalid submit', () => {
      component.onSubmit();
      expect(component.form.get('email')?.touched).toBe(true);
    });

    it('should call login on valid submit', fakeAsync(() => {
      const mockResponse = {
        user: {
          id: 'usr-001',
          email: 'admin@demo.com',
          firstName: 'Admin',
          lastName: 'User',
          role: Role.Admin,
        },
        accessToken: 'token',
        refreshToken: 'refresh',
      };

      authServiceSpy.login.mockReturnValue(of(mockResponse));

      component.form.patchValue({
        email: 'admin@demo.com',
        password: 'password',
      });
      component.onSubmit();

      expect(component.loading()).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should handle login error', fakeAsync(() => {
      authServiceSpy.login.mockReturnValue(
        throwError(() => new Error('Invalid credentials')),
      );

      component.form.patchValue({
        email: 'wrong@demo.com',
        password: 'wrongpass',
      });
      component.onSubmit();

      expect(component.loading()).toBe(false);
      expect(component.errorMessage()).toBe('Invalid credentials');
    }));
  });

  describe('fillDemoCredentials', () => {
    it('should fill form with demo values', () => {
      component.fillDemoCredentials();

      expect(component.form.get('email')?.value).toBe('admin@demo.com');
      expect(component.form.get('password')?.value).toBe('password');
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword()).toBe(true);
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);
    });
  });
});
