import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, delay, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/auth.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authServiceSpy: {
    register: jest.Mock;
    currentUser: ReturnType<typeof signal>;
    isAuthenticated: ReturnType<typeof signal>;
  };
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceSpy = {
      register: jest.fn(),
      currentUser: signal(null),
      isAuthenticated: signal(false),
    };
    routerSpy = { navigate: jest.fn().mockResolvedValue(true) };

    TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(RegisterComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    const fixture = TestBed.createComponent(RegisterComponent);
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

  it('should have no error message initially', () => {
    expect(component.errorMessage()).toBeNull();
  });

  describe('form validation', () => {
    it('should require firstName', () => {
      component.form.patchValue({ firstName: '' });
      expect(component.form.get('firstName')?.hasError('required')).toBe(true);
    });

    it('should require firstName minimum 2 characters', () => {
      component.form.patchValue({ firstName: 'A' });
      expect(component.form.get('firstName')?.hasError('minlength')).toBe(
        true,
      );
    });

    it('should require lastName', () => {
      component.form.patchValue({ lastName: '' });
      expect(component.form.get('lastName')?.hasError('required')).toBe(true);
    });

    it('should require lastName minimum 2 characters', () => {
      component.form.patchValue({ lastName: 'B' });
      expect(component.form.get('lastName')?.hasError('minlength')).toBe(true);
    });

    it('should require email', () => {
      component.form.patchValue({ email: '' });
      expect(component.form.get('email')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      component.form.patchValue({ email: 'invalid' });
      expect(component.form.get('email')?.hasError('email')).toBe(true);
    });

    it('should require password', () => {
      component.form.patchValue({ password: '' });
      expect(component.form.get('password')?.hasError('required')).toBe(true);
    });

    it('should require minimum 6 char password', () => {
      component.form.patchValue({ password: '123' });
      expect(component.form.get('password')?.hasError('minlength')).toBe(true);
    });

    it('should require confirmPassword', () => {
      component.form.patchValue({ confirmPassword: '' });
      expect(
        component.form.get('confirmPassword')?.hasError('required'),
      ).toBe(true);
    });

    it('should detect password mismatch', () => {
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'different',
      });
      expect(component.form.hasError('passwordMismatch')).toBe(true);
    });

    it('should accept matching passwords', () => {
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(component.form.valid).toBe(true);
    });

    it('should not flag mismatch when passwords are empty', () => {
      component.form.patchValue({
        password: '',
        confirmPassword: '',
      });
      expect(component.form.hasError('passwordMismatch')).toBe(false);
    });
  });

  describe('getFieldError', () => {
    it('should return required message for firstName', () => {
      component.form.get('firstName')?.markAsTouched();
      expect(component.getFieldError('firstName')).toBe(
        'First name is required',
      );
    });

    it('should return required message for lastName', () => {
      component.form.get('lastName')?.markAsTouched();
      expect(component.getFieldError('lastName')).toBe(
        'Last name is required',
      );
    });

    it('should return required message for email', () => {
      component.form.get('email')?.markAsTouched();
      expect(component.getFieldError('email')).toBe('Email is required');
    });

    it('should return required message for password', () => {
      component.form.get('password')?.markAsTouched();
      expect(component.getFieldError('password')).toBe('Password is required');
    });

    it('should return minlength message', () => {
      component.form.patchValue({ firstName: 'A' });
      component.form.get('firstName')?.markAsTouched();
      expect(component.getFieldError('firstName')).toBe(
        'Must be at least 2 characters',
      );
    });

    it('should return email format message', () => {
      component.form.patchValue({ email: 'invalid' });
      component.form.get('email')?.markAsTouched();
      expect(component.getFieldError('email')).toBe(
        'Enter a valid email address',
      );
    });

    it('should return empty string when no errors', () => {
      component.form.patchValue({ firstName: 'John' });
      expect(component.getFieldError('firstName')).toBe('');
    });

    it('should return required message for confirmPassword', () => {
      component.form.get('confirmPassword')?.markAsTouched();
      expect(component.getFieldError('confirmPassword')).toBe(
        'Password confirmation is required',
      );
    });
  });

  describe('getConfirmPasswordError', () => {
    it('should return required message', () => {
      component.form.get('confirmPassword')?.markAsTouched();
      expect(component.getConfirmPasswordError()).toBe(
        'Please confirm your password',
      );
    });

    it('should return mismatch message when passwords differ', () => {
      component.form.patchValue({
        password: 'password123',
        confirmPassword: 'different',
      });
      component.form.get('confirmPassword')?.markAsTouched();
      expect(component.getConfirmPasswordError()).toBe(
        'Passwords do not match',
      );
    });

    it('should return empty string when matching', () => {
      component.form.patchValue({
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.form.get('confirmPassword')?.markAsTouched();
      expect(component.getConfirmPasswordError()).toBe('');
    });
  });

  describe('togglePasswordVisibility', () => {
    it('should toggle password visibility', () => {
      expect(component.hidePassword()).toBe(true);
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(false);
      component.togglePasswordVisibility();
      expect(component.hidePassword()).toBe(true);
    });
  });

  describe('toggleConfirmPasswordVisibility', () => {
    it('should toggle confirm password visibility', () => {
      expect(component.hideConfirmPassword()).toBe(true);
      component.toggleConfirmPasswordVisibility();
      expect(component.hideConfirmPassword()).toBe(false);
    });
  });

  describe('onSubmit', () => {
    it('should not submit invalid form', () => {
      component.onSubmit();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    });

    it('should mark form as touched on invalid submit', () => {
      component.onSubmit();
      expect(component.form.get('email')?.touched).toBe(true);
      expect(component.form.get('firstName')?.touched).toBe(true);
    });

    it('should call register on valid submit', fakeAsync(() => {
      const mockResponse = {
        user: {
          id: 'usr-new',
          email: 'john@test.com',
          firstName: 'John',
          lastName: 'Doe',
          role: Role.Viewer,
        },
        accessToken: 'token',
        refreshToken: 'refresh',
      };

      authServiceSpy.register.mockReturnValue(of(mockResponse));

      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();

      expect(component.loading()).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    }));

    it('should set loading state during submit', fakeAsync(() => {
      authServiceSpy.register.mockReturnValue(
        of({
          user: {
            id: 'usr-new',
            email: 'john@test.com',
            firstName: 'John',
            lastName: 'Doe',
            role: Role.Viewer,
          },
          accessToken: 'token',
          refreshToken: 'refresh',
        }).pipe(delay(500)),
      );

      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();
      expect(component.loading()).toBe(true);

      tick(500);
      expect(component.loading()).toBe(false);
    }));

    it('should handle registration error', fakeAsync(() => {
      authServiceSpy.register.mockReturnValue(
        throwError(() => new Error('Email already exists')),
      );

      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();

      expect(component.loading()).toBe(false);
      expect(component.errorMessage()).toBe('Email already exists');
    }));

    it('should show default error when message is empty', fakeAsync(() => {
      authServiceSpy.register.mockReturnValue(
        throwError(() => new Error('')),
      );

      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();

      expect(component.errorMessage()).toBe(
        'Registration failed. Please try again.',
      );
    }));

    it('should exclude confirmPassword from register payload', fakeAsync(() => {
      authServiceSpy.register.mockReturnValue(
        of({
          user: {
            id: 'usr-new',
            email: 'john@test.com',
            firstName: 'John',
            lastName: 'Doe',
            role: Role.Viewer,
          },
          accessToken: 'token',
          refreshToken: 'refresh',
        }),
      );

      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      component.onSubmit();

      const callArg = authServiceSpy.register.mock.calls[0][0];
      expect(callArg).not.toHaveProperty('confirmPassword');
      expect(callArg).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123',
      });
    }));
  });
});
