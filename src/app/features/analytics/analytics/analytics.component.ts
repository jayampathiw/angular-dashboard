import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnalyticsKpiRowComponent } from '../components/analytics-kpi-row/analytics-kpi-row.component';
import { TrafficChartComponent } from '../components/traffic-chart/traffic-chart.component';
import { ChannelChartComponent } from '../components/channel-chart/channel-chart.component';
import { DeviceChartComponent } from '../components/device-chart/device-chart.component';
import { AnalyticsStore } from '../store/analytics.store';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    AnalyticsKpiRowComponent,
    TrafficChartComponent,
    ChannelChartComponent,
    DeviceChartComponent,
  ],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent {
  readonly store = inject(AnalyticsStore);
  readonly themeService = inject(ThemeService);
}
