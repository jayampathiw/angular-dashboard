import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentRef } from '@angular/core';
import { KpiCardComponent } from './kpi-card.component';
import { KpiMetric } from '../../models/dashboard.model';

describe('KpiCardComponent', () => {
  let component: KpiCardComponent;
  let componentRef: ComponentRef<KpiCardComponent>;
  let fixture: ComponentFixture<KpiCardComponent>;

  const mockMetric: KpiMetric = {
    id: 'revenue',
    label: 'Total Revenue',
    value: 125400,
    previousValue: 118200,
    format: 'currency',
    icon: 'attach_money',
    trend: 'up',
    trendValue: 6.1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KpiCardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(KpiCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('metric', mockMetric);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('formattedValue', () => {
    it('should format currency values with $ prefix', () => {
      expect(component.formattedValue()).toBe('$125,400');
    });

    it('should format percent values with % suffix', () => {
      componentRef.setInput('metric', {
        ...mockMetric,
        value: 85,
        format: 'percent',
      });
      fixture.detectChanges();
      expect(component.formattedValue()).toBe('85%');
    });

    it('should format number values with locale string', () => {
      componentRef.setInput('metric', {
        ...mockMetric,
        value: 10450,
        format: 'number',
      });
      fixture.detectChanges();
      expect(component.formattedValue()).toBe('10,450');
    });
  });

  describe('trendIcon', () => {
    it('should return trending_up for up trend', () => {
      expect(component.trendIcon()).toBe('trending_up');
    });

    it('should return trending_down for down trend', () => {
      componentRef.setInput('metric', { ...mockMetric, trend: 'down' });
      fixture.detectChanges();
      expect(component.trendIcon()).toBe('trending_down');
    });
  });
});
