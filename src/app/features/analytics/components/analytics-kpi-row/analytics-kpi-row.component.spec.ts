import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { AnalyticsKpiRowComponent } from './analytics-kpi-row.component';
import { AnalyticsKpi } from '../../models/analytics.model';

describe('AnalyticsKpiRowComponent', () => {
  let component: AnalyticsKpiRowComponent;
  let componentRef: ComponentRef<AnalyticsKpiRowComponent>;
  let fixture: ComponentFixture<AnalyticsKpiRowComponent>;

  const mockKpis: AnalyticsKpi[] = [
    {
      id: 'sessions',
      title: 'Total Sessions',
      value: 24500,
      format: 'number',
      trend: 12.5,
      icon: 'groups',
    },
    {
      id: 'bounce',
      title: 'Bounce Rate',
      value: 42,
      format: 'percent',
      trend: -3.2,
      icon: 'trending_down',
    },
    {
      id: 'duration',
      title: 'Avg. Duration',
      value: 195,
      format: 'duration',
      trend: 8.1,
      icon: 'timer',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnalyticsKpiRowComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(AnalyticsKpiRowComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(AnalyticsKpiRowComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('kpis', mockKpis);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should receive kpis input', () => {
    expect(component.kpis()).toHaveLength(3);
  });

  describe('formatValue', () => {
    it('should format large numbers with K suffix', () => {
      expect(component.formatValue(mockKpis[0])).toBe('24.5K');
    });

    it('should format small numbers as plain string', () => {
      const smallKpi: AnalyticsKpi = {
        ...mockKpis[0],
        value: 500,
        format: 'number',
      };
      expect(component.formatValue(smallKpi)).toBe('500');
    });

    it('should format percent values with % suffix', () => {
      expect(component.formatValue(mockKpis[1])).toBe('42%');
    });

    it('should format duration as minutes and seconds', () => {
      expect(component.formatValue(mockKpis[2])).toBe('3m 15s');
    });

    it('should handle zero duration', () => {
      const zeroDuration: AnalyticsKpi = {
        ...mockKpis[2],
        value: 0,
        format: 'duration',
      };
      expect(component.formatValue(zeroDuration)).toBe('0m 0s');
    });

    it('should handle exact minute duration', () => {
      const exactMinute: AnalyticsKpi = {
        ...mockKpis[2],
        value: 120,
        format: 'duration',
      };
      expect(component.formatValue(exactMinute)).toBe('2m 0s');
    });

    it('should format numbers at exactly 1000 with K suffix', () => {
      const kpi: AnalyticsKpi = {
        ...mockKpis[0],
        value: 1000,
        format: 'number',
      };
      expect(component.formatValue(kpi)).toBe('1.0K');
    });
  });
});
