import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsStore } from '../store/analytics.store';
import { ThemeService } from '../../../core/services/theme.service';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  const mockStore = {
    kpis: signal([]),
    trafficData: signal([]),
    channelData: signal([]),
    deviceData: signal([]),
    loading: signal(false),
    error: signal(null),
    totalSessions: signal(0),
    loadAnalytics: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [
        { provide: AnalyticsStore, useValue: mockStore },
        {
          provide: ThemeService,
          useValue: { isDarkMode: signal(false), toggleTheme: jest.fn() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(AnalyticsComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should inject AnalyticsStore', () => {
    expect(component.store).toBeTruthy();
  });

  it('should inject ThemeService', () => {
    expect(component.themeService).toBeTruthy();
  });

  it('should expose store loading state', () => {
    expect(component.store.loading()).toBe(false);
  });

  it('should expose store kpis', () => {
    expect(component.store.kpis()).toEqual([]);
  });
});
