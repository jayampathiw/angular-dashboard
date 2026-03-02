import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsKpi } from '../../models/analytics.model';

@Component({
  selector: 'app-analytics-kpi-row',
  standalone: true,
  imports: [DecimalPipe, MatIconModule],
  templateUrl: './analytics-kpi-row.component.html',
  styleUrl: './analytics-kpi-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsKpiRowComponent {
  readonly kpis = input.required<AnalyticsKpi[]>();

  formatValue(kpi: AnalyticsKpi): string {
    switch (kpi.format) {
      case 'number':
        return kpi.value >= 1000
          ? (kpi.value / 1000).toFixed(1) + 'K'
          : kpi.value.toString();
      case 'percent':
        return kpi.value + '%';
      case 'duration': {
        const min = Math.floor(kpi.value / 60);
        const sec = kpi.value % 60;
        return `${min}m ${sec}s`;
      }
    }
  }
}
