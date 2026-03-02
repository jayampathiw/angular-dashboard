import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/models/auth.model';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let themeServiceSpy: { isDarkMode: ReturnType<typeof signal>; toggleTheme: jest.Mock };

  beforeEach(() => {
    themeServiceSpy = {
      isDarkMode: signal(false),
      toggleTheme: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        { provide: ThemeService, useValue: themeServiceSpy },
        {
          provide: AuthService,
          useValue: {
            currentUser: signal({
              id: 'usr-001',
              email: 'admin@demo.com',
              firstName: 'Admin',
              lastName: 'User',
              role: Role.Admin,
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize profile from auth user', () => {
    expect(component.profile().firstName).toBe('Admin');
    expect(component.profile().email).toBe('admin@demo.com');
  });

  it('should initialize notification prefs', () => {
    expect(component.notifications().emailNotifications).toBe(true);
    expect(component.notifications().frequency).toBe('daily');
  });

  it('should expose isDarkMode from theme service', () => {
    expect(component.isDarkMode()).toBe(false);
  });

  it('should update profile on save', () => {
    const newProfile = {
      firstName: 'Updated',
      lastName: 'Name',
      email: 'new@email.com',
      phone: '555-0000',
      company: 'New Co',
      department: 'Sales',
    };

    component.onProfileSaved(newProfile);

    expect(component.profile().firstName).toBe('Updated');
    expect(component.profile().company).toBe('New Co');
  });

  it('should update notifications on change', () => {
    component.onNotificationsChanged({ marketingEmails: true });

    expect(component.notifications().marketingEmails).toBe(true);
    expect(component.notifications().emailNotifications).toBe(true);
  });

  it('should toggle theme', () => {
    component.onThemeToggled();
    expect(themeServiceSpy.toggleTheme).toHaveBeenCalled();
  });
});
