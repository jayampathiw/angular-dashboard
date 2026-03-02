import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { TrafficDataPoint } from '../../models/analytics.model';

@Component({
  selector: 'app-traffic-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-card">
      <h3 class="chart-title">Traffic Trends</h3>
      <div class="chart-wrapper">
        <canvas baseChart type="line"
          [data]="chartData()"
          [options]="chartOptions()"></canvas>
      </div>
    </div>
  `,
  styleUrl: './traffic-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrafficChartComponent {
  readonly data = input.required<TrafficDataPoint[]>();
  readonly isDarkMode = input(false);

  chartData = computed<ChartData<'line'>>(() => {
    const points = this.data();
    return {
      labels: points.map((d) => d.date),
      datasets: [
        {
          label: 'Page Views',
          data: points.map((d) => d.pageViews),
          borderColor: '#0078D4',
          backgroundColor: 'rgba(0, 120, 212, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#0078D4',
          borderWidth: 2,
        },
        {
          label: 'Visitors',
          data: points.map((d) => d.visitors),
          borderColor: '#107C10',
          backgroundColor: 'rgba(16, 124, 16, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#107C10',
          borderWidth: 2,
          borderDash: [5, 5],
        },
      ],
    };
  });

  chartOptions = computed<ChartOptions<'line'>>(() => {
    const isDark = this.isDarkMode();
    const textColor = isDark ? '#c4c7c5' : '#49454f';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: { color: textColor, usePointStyle: true, pointStyle: 'circle', padding: 16 },
        },
        tooltip: {
          backgroundColor: isDark ? '#2b2d30' : '#fff',
          titleColor: isDark ? '#e3e3e3' : '#1d1b20',
          bodyColor: isDark ? '#c4c7c5' : '#49454f',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 12,
        },
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: {
          beginAtZero: false,
          ticks: {
            color: textColor,
            callback: (val) => Number(val) >= 1000 ? Number(val) / 1000 + 'K' : val,
          },
          grid: { color: gridColor },
        },
      },
    };
  });
}
