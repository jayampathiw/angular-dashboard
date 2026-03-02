import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { CategoryChartComponent } from './category-chart.component';
import { CategoryDataPoint } from '../../models/dashboard.model';

describe('CategoryChartComponent', () => {
  let component: CategoryChartComponent;
  let componentRef: ComponentRef<CategoryChartComponent>;
  let fixture: ComponentFixture<CategoryChartComponent>;

  const mockData: CategoryDataPoint[] = [
    { category: 'Electronics', value: 45000, color: '#0078D4' },
    { category: 'Clothing', value: 32000, color: '#107C10' },
    { category: 'Books', value: 18000, color: '#E86C44' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CategoryChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(CategoryChartComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(CategoryChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('chartData', () => {
    it('should map categories to labels', () => {
      const chart = component.chartData();
      expect(chart.labels).toEqual(['Electronics', 'Clothing', 'Books']);
    });

    it('should have one dataset', () => {
      const chart = component.chartData();
      expect(chart.datasets).toHaveLength(1);
      expect(chart.datasets[0].label).toBe('Sales');
    });

    it('should map values correctly', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].data).toEqual([45000, 32000, 18000]);
    });

    it('should apply colors with CC opacity suffix', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].backgroundColor).toEqual([
        '#0078D4CC',
        '#107C10CC',
        '#E86C44CC',
      ]);
    });
  });

  describe('chartOptions', () => {
    it('should be responsive', () => {
      expect(component.chartOptions().responsive).toBe(true);
    });

    it('should hide legend', () => {
      expect(component.chartOptions().plugins?.legend?.display).toBe(false);
    });

    it('should adapt to dark mode', () => {
      componentRef.setInput('isDarkMode', true);
      fixture.detectChanges();

      const opts = component.chartOptions();
      const yTicks = (opts.scales?.['y'] as any)?.ticks;
      expect(yTicks?.color).toBe('#c4c7c5');
    });
  });
});
