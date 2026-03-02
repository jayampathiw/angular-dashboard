import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { DistributionChartComponent } from './distribution-chart.component';
import { DistributionSegment } from '../../models/dashboard.model';

describe('DistributionChartComponent', () => {
  let component: DistributionChartComponent;
  let componentRef: ComponentRef<DistributionChartComponent>;
  let fixture: ComponentFixture<DistributionChartComponent>;

  const mockData: DistributionSegment[] = [
    { source: 'Direct', percentage: 40, color: '#0078D4' },
    { source: 'Organic', percentage: 35, color: '#107C10' },
    { source: 'Referral', percentage: 25, color: '#E86C44' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DistributionChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(DistributionChartComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(DistributionChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('chartData', () => {
    it('should map sources to labels', () => {
      const chart = component.chartData();
      expect(chart.labels).toEqual(['Direct', 'Organic', 'Referral']);
    });

    it('should map percentages to data', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].data).toEqual([40, 35, 25]);
    });

    it('should apply colors with CC opacity suffix', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].backgroundColor).toEqual([
        '#0078D4CC',
        '#107C10CC',
        '#E86C44CC',
      ]);
    });

    it('should have zero borderWidth', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].borderWidth).toBe(0);
    });
  });

  describe('chartOptions', () => {
    it('should be responsive', () => {
      expect(component.chartOptions().responsive).toBe(true);
    });

    it('should set cutout to 65%', () => {
      expect((component.chartOptions() as any).cutout).toBe('65%');
    });

    it('should position legend at bottom', () => {
      expect(component.chartOptions().plugins?.legend?.position).toBe(
        'bottom',
      );
    });

    it('should adapt to dark mode', () => {
      componentRef.setInput('isDarkMode', true);
      fixture.detectChanges();

      const opts = component.chartOptions();
      const labels = opts.plugins?.legend?.labels as any;
      expect(labels?.color).toBe('#c4c7c5');
    });
  });
});
