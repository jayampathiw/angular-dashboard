import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoryDataPoint } from '../../models/dashboard.model';

@Component({
  selector: 'app-category-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './category-chart.component.html',
  styleUrl: './category-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryChartComponent {
  readonly data = input.required<CategoryDataPoint[]>();
  readonly isDarkMode = input(false);

  chartData = computed<ChartData<'bar'>>(() => {
    const points = this.data();
    return {
      labels: points.map((d) => d.category),
      datasets: [
        {
          label: 'Sales',
          data: points.map((d) => d.value),
          backgroundColor: points.map((d) => d.color + 'CC'),
          hoverBackgroundColor: points.map((d) => d.color),
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  });

  chartOptions = computed<ChartOptions<'bar'>>(() => {
    const isDark = this.isDarkMode();
    const textColor = isDark ? '#c4c7c5' : '#49454f';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
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
            label: (ctx) =>
              ` $${(ctx.parsed.y ?? 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
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
