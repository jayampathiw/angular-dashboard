import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DeviceData } from '../../models/analytics.model';

@Component({
  selector: 'app-device-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-card">
      <h3 class="chart-title">Device Breakdown</h3>
      <div class="chart-wrapper">
        <canvas baseChart type="doughnut"
          [data]="chartData()"
          [options]="chartOptions()"></canvas>
      </div>
    </div>
  `,
  styleUrl: './device-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceChartComponent {
  readonly data = input.required<DeviceData[]>();
  readonly isDarkMode = input(false);

  chartData = computed<ChartData<'doughnut'>>(() => {
    const devices = this.data();
    return {
      labels: devices.map((d) => d.device),
      datasets: [
        {
          data: devices.map((d) => d.percentage),
          backgroundColor: devices.map((d) => d.color + 'CC'),
          hoverBackgroundColor: devices.map((d) => d.color),
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  });

  chartOptions = computed<ChartOptions<'doughnut'>>(() => {
    const isDark = this.isDarkMode();
    const textColor = isDark ? '#c4c7c5' : '#49454f';

    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: textColor, usePointStyle: true, pointStyle: 'circle', padding: 16 },
        },
        tooltip: {
          backgroundColor: isDark ? '#2b2d30' : '#fff',
          titleColor: isDark ? '#e3e3e3' : '#1d1b20',
          bodyColor: isDark ? '#c4c7c5' : '#49454f',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
    };
  });
}
