import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardStore } from '../store/dashboard.store';
import { ThemeService } from '../../../core/services/theme.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockStore = {
    kpis: signal([]),
    revenueData: signal([]),
    categoryData: signal([]),
    distributionData: signal([]),
    activities: signal([]),
    recentActivities: signal([]),
    loading: signal(false),
    error: signal(null),
    totalRevenue: signal(0),
    revenueGrowth: signal(0),
    loadDashboardData: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardStore, useValue: mockStore },
        {
          provide: ThemeService,
          useValue: { isDarkMode: signal(false), toggleTheme: jest.fn() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(DashboardComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should inject DashboardStore', () => {
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
