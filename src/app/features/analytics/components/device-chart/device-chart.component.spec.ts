import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { DeviceChartComponent } from './device-chart.component';
import { DeviceData } from '../../models/analytics.model';

describe('DeviceChartComponent', () => {
  let component: DeviceChartComponent;
  let componentRef: ComponentRef<DeviceChartComponent>;
  let fixture: ComponentFixture<DeviceChartComponent>;

  const mockData: DeviceData[] = [
    { device: 'Desktop', percentage: 55, color: '#0078D4' },
    { device: 'Mobile', percentage: 35, color: '#107C10' },
    { device: 'Tablet', percentage: 10, color: '#E86C44' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DeviceChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(DeviceChartComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(DeviceChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('chartData', () => {
    it('should map devices to labels', () => {
      const chart = component.chartData();
      expect(chart.labels).toEqual(['Desktop', 'Mobile', 'Tablet']);
    });

    it('should map percentages to data', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].data).toEqual([55, 35, 10]);
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
