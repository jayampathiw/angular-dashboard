import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { RevenueChartComponent } from './revenue-chart.component';
import { RevenueDataPoint } from '../../models/dashboard.model';

describe('RevenueChartComponent', () => {
  let component: RevenueChartComponent;
  let componentRef: ComponentRef<RevenueChartComponent>;
  let fixture: ComponentFixture<RevenueChartComponent>;

  const mockData: RevenueDataPoint[] = [
    { month: 'Jan', revenue: 45000, expenses: 32000 },
    { month: 'Feb', revenue: 52000, expenses: 34000 },
    { month: 'Mar', revenue: 48000, expenses: 31000 },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RevenueChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(RevenueChartComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(RevenueChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('chartData', () => {
    it('should map months to labels', () => {
      const chart = component.chartData();
      expect(chart.labels).toEqual(['Jan', 'Feb', 'Mar']);
    });

    it('should have two datasets (Revenue and Expenses)', () => {
      const chart = component.chartData();
      expect(chart.datasets).toHaveLength(2);
      expect(chart.datasets[0].label).toBe('Revenue');
      expect(chart.datasets[1].label).toBe('Expenses');
    });

    it('should map revenue values correctly', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].data).toEqual([45000, 52000, 48000]);
    });

    it('should map expense values correctly', () => {
      const chart = component.chartData();
      expect(chart.datasets[1].data).toEqual([32000, 34000, 31000]);
    });
  });

  describe('chartOptions', () => {
    it('should be responsive', () => {
      expect(component.chartOptions().responsive).toBe(true);
    });

    it('should not maintain aspect ratio', () => {
      expect(component.chartOptions().maintainAspectRatio).toBe(false);
    });

    it('should use light colors by default', () => {
      const opts = component.chartOptions();
      const xTicks = (opts.scales?.['x'] as any)?.ticks;
      expect(xTicks?.color).toBe('#49454f');
    });

    it('should use dark colors when isDarkMode is true', () => {
      componentRef.setInput('isDarkMode', true);
      fixture.detectChanges();

      const opts = component.chartOptions();
      const xTicks = (opts.scales?.['x'] as any)?.ticks;
      expect(xTicks?.color).toBe('#c4c7c5');
    });
  });
});
