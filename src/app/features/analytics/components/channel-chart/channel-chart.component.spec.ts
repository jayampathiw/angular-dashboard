import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { ChannelChartComponent } from './channel-chart.component';
import { ChannelData } from '../../models/analytics.model';

describe('ChannelChartComponent', () => {
  let component: ChannelChartComponent;
  let componentRef: ComponentRef<ChannelChartComponent>;
  let fixture: ComponentFixture<ChannelChartComponent>;

  const mockData: ChannelData[] = [
    { channel: 'Organic Search', sessions: 12500, color: '#0078D4' },
    { channel: 'Direct', sessions: 8300, color: '#107C10' },
    { channel: 'Social', sessions: 5200, color: '#E86C44' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChannelChartComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(ChannelChartComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    fixture = TestBed.createComponent(ChannelChartComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('chartData', () => {
    it('should map channels to labels', () => {
      const chart = component.chartData();
      expect(chart.labels).toEqual(['Organic Search', 'Direct', 'Social']);
    });

    it('should have one dataset with Sessions label', () => {
      const chart = component.chartData();
      expect(chart.datasets).toHaveLength(1);
      expect(chart.datasets[0].label).toBe('Sessions');
    });

    it('should map session values correctly', () => {
      const chart = component.chartData();
      expect(chart.datasets[0].data).toEqual([12500, 8300, 5200]);
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

    it('should use horizontal bars (indexAxis y)', () => {
      expect((component.chartOptions() as any).indexAxis).toBe('y');
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
