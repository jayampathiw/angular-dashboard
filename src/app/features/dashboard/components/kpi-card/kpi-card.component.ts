import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { KpiMetric } from '../../models/dashboard.model';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  readonly metric = input.required<KpiMetric>();

  formattedValue = computed(() => {
    const m = this.metric();
    switch (m.format) {
      case 'currency':
        return '$' + m.value.toLocaleString();
      case 'percent':
        return m.value + '%';
      default:
        return m.value.toLocaleString();
    }
  });

  trendIcon = computed(() =>
    this.metric().trend === 'up' ? 'trending_up' : 'trending_down',
  );
}
