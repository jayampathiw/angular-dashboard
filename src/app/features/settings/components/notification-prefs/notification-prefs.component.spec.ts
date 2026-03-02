import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  NotificationPrefsComponent,
  NotificationPrefs,
} from './notification-prefs.component';

describe('NotificationPrefsComponent', () => {
  let component: NotificationPrefsComponent;
  let componentRef: ComponentRef<NotificationPrefsComponent>;

  const mockPrefs: NotificationPrefs = {
    emailNotifications: true,
    securityAlerts: true,
    productUpdates: false,
    marketingEmails: false,
    frequency: 'daily',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotificationPrefsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(NotificationPrefsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('prefs', mockPrefs);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit toggle change', () => {
    const spy = jest.fn();
    component.prefsChanged.subscribe(spy);

    component.onToggle('emailNotifications', false);

    expect(spy).toHaveBeenCalledWith({ emailNotifications: false });
  });

  it('should emit frequency change', () => {
    const spy = jest.fn();
    component.prefsChanged.subscribe(spy);

    component.onFrequencyChange('weekly');

    expect(spy).toHaveBeenCalledWith({ frequency: 'weekly' });
  });
});
