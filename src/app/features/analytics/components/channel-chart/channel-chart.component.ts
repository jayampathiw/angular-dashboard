import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ChannelData } from '../../models/analytics.model';

@Component({
  selector: 'app-channel-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-card">
      <h3 class="chart-title">Traffic by Channel</h3>
      <div class="chart-wrapper">
        <canvas baseChart type="bar"
          [data]="chartData()"
          [options]="chartOptions()"></canvas>
      </div>
    </div>
  `,
  styleUrl: './channel-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelChartComponent {
  readonly data = input.required<ChannelData[]>();
  readonly isDarkMode = input(false);

  chartData = computed<ChartData<'bar'>>(() => {
    const channels = this.data();
    return {
      labels: channels.map((c) => c.channel),
      datasets: [
        {
          label: 'Sessions',
          data: channels.map((c) => c.sessions),
          backgroundColor: channels.map((c) => c.color + 'CC'),
          hoverBackgroundColor: channels.map((c) => c.color),
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
      indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#2b2d30' : '#fff',
          titleColor: isDark ? '#e3e3e3' : '#1d1b20',
          bodyColor: isDark ? '#c4c7c5' : '#49454f',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: (ctx) => ` ${(ctx.parsed.x ?? 0).toLocaleString()} sessions`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: textColor,
            callback: (val) => Number(val) >= 1000 ? Number(val) / 1000 + 'K' : val,
          },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: textColor },
          grid: { display: false },
        },
      },
    };
  });
}
