import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DistributionSegment } from '../../models/dashboard.model';

@Component({
  selector: 'app-distribution-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './distribution-chart.component.html',
  styleUrl: './distribution-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionChartComponent {
  readonly data = input.required<DistributionSegment[]>();
  readonly isDarkMode = input(false);

  chartData = computed<ChartData<'doughnut'>>(() => {
    const segments = this.data();
    return {
      labels: segments.map((d) => d.source),
      datasets: [
        {
          data: segments.map((d) => d.percentage),
          backgroundColor: segments.map((d) => d.color + 'CC'),
          hoverBackgroundColor: segments.map((d) => d.color),
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
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
    };
  });
}
