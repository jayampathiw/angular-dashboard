import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { KpiCardComponent } from '../components/kpi-card/kpi-card.component';
import { RevenueChartComponent } from '../components/revenue-chart/revenue-chart.component';
import { CategoryChartComponent } from '../components/category-chart/category-chart.component';
import { DistributionChartComponent } from '../components/distribution-chart/distribution-chart.component';
import { ActivityFeedComponent } from '../components/activity-feed/activity-feed.component';
import { DashboardStore } from '../store/dashboard.store';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    KpiCardComponent,
    RevenueChartComponent,
    CategoryChartComponent,
    DistributionChartComponent,
    ActivityFeedComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly store = inject(DashboardStore);
  readonly themeService = inject(ThemeService);
}
