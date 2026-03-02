import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { TrafficChartComponent } from './traffic-chart.component';
import { TrafficDataPoint } from '../../models/analytics.model';

describe('TrafficChartComponent', () => {
  let component: TrafficChartComponent;
  let componentRef: ComponentRef<TrafficChartComponent>;
  let fixture: ComponentFixture<TrafficChartComponent>;

  const mockData: TrafficDataPoint[] = [
    { date: 'Mon', visitors: 1200, pageViews: 3400 },
    { date: 'Tue', visitors: 1500, pageViews: 4100 },
    { date: 'Wed', visitors: 1100, pageViews: 2900 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TrafficChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(TrafficChartComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(TrafficChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('chartData', () => {
    it('should map dates to labels', () => {
      const chart = component.chartData();
      expect(chart.labels).toEqual(['Mon', 'Tue', 'Wed']);
    });

    it('should have two datasets (Page Views and Visitors)', () => {
      const chart = component.chartData();
      expect(chart.datasets).toHaveLength(2);
      expect(chart.datasets[0].label).toBe('Page Views');
      expect(chart.datasets[1].label).toBe('Visitors');
    });

    it('should map page views correctly', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].data).toEqual([3400, 4100, 2900]);
    });

    it('should map visitors correctly', () => {
      const chart = component.chartData();
      expect(chart.datasets[1].data).toEqual([1200, 1500, 1100]);
    });
  });

  describe('chartOptions', () => {
    it('should be responsive', () => {
      expect(component.chartOptions().responsive).toBe(true);
    });

    it('should use light mode colors by default', () => {
      const opts = component.chartOptions();
      const xTicks = (opts.scales?.['x'] as any)?.ticks;
      expect(xTicks?.color).toBe('#49454f');
    });

    it('should use dark mode colors when enabled', () => {
      componentRef.setInput('isDarkMode', true);
      fixture.detectChanges();

      const opts = component.chartOptions();
      const xTicks = (opts.scales?.['x'] as any)?.ticks;
      expect(xTicks?.color).toBe('#c4c7c5');
    });
  });
});
