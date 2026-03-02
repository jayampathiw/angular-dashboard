import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { RevenueDataPoint } from '../../models/dashboard.model';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevenueChartComponent {
  readonly data = input.required<RevenueDataPoint[]>();
  readonly isDarkMode = input(false);

  chartData = computed<ChartData<'line'>>(() => {
    const points = this.data();
    return {
      labels: points.map((d) => d.month),
      datasets: [
        {
          label: 'Revenue',
          data: points.map((d) => d.revenue),
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
          label: 'Expenses',
          data: points.map((d) => d.expenses),
          borderColor: '#E86C44',
          backgroundColor: 'rgba(232, 108, 68, 0.08)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#E86C44',
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
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#2b2d30' : '#fff',
          titleColor: isDark ? '#e3e3e3' : '#1d1b20',
          bodyColor: isDark ? '#c4c7c5' : '#49454f',
          borderColor: isDark
            ? 'rgba(255,255,255,0.1)'
            : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 12,
          boxPadding: 4,
          callbacks: {
            label: (ctx) =>
              ` ${ctx.dataset.label}: $${((ctx.parsed.y ?? 0) / 1000).toFixed(0)}K`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { color: gridColor },
        },
        y: {
          beginAtZero: false,
          ticks: {
            color: textColor,
            callback: (val) => '$' + Number(val) / 1000 + 'K',
          },
          grid: { color: gridColor },
        },
      },
    };
  });
}
