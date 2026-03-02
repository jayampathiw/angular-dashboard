import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderComponent } from './header.component';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Role, User } from '../../../core/models/auth.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  const userSignal = signal<User | null>(null);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: ThemeService,
          useValue: { isDarkMode: signal(false), toggleTheme: jest.fn() },
        },
        {
          provide: AuthService,
          useValue: {
            currentUser: userSignal,
            isAuthenticated: signal(false),
            logout: jest.fn(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should return ? for initials when no user', () => {
    userSignal.set(null);
    expect(component.userInitials()).toBe('?');
  });

  it('should compute user initials', () => {
    userSignal.set({
      id: 'usr-001',
      email: 'admin@demo.com',
      firstName: 'Admin',
      lastName: 'User',
      role: Role.Admin,
    });
    expect(component.userInitials()).toBe('AU');
  });

  it('should compute full name', () => {
    userSignal.set({
      id: 'usr-001',
      email: 'admin@demo.com',
      firstName: 'Admin',
      lastName: 'User',
      role: Role.Admin,
    });
    expect(component.userFullName()).toBe('Admin User');
  });

  it('should return empty string for full name when no user', () => {
    userSignal.set(null);
    expect(component.userFullName()).toBe('');
  });
});
