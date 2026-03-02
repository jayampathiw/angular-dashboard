import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import {
  KpiMetric,
  RevenueDataPoint,
  CategoryDataPoint,
  DistributionSegment,
  ActivityItem,
} from '../models/dashboard.model';
import {
  MOCK_KPI_METRICS,
  MOCK_REVENUE_DATA,
  MOCK_CATEGORY_DATA,
  MOCK_DISTRIBUTION_DATA,
  MOCK_ACTIVITIES,
} from '../data/dashboard-mock.data';

interface DashboardState {
  kpis: KpiMetric[];
  revenueData: RevenueDataPoint[];
  categoryData: CategoryDataPoint[];
  distributionData: DistributionSegment[];
  activities: ActivityItem[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  kpis: [],
  revenueData: [],
  categoryData: [],
  distributionData: [],
  activities: [],
  loading: false,
  error: null,
};

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ kpis, revenueData, activities }) => ({
    totalRevenue: computed(() => {
      const metric = kpis().find((k) => k.id === 'revenue');
      return metric?.value ?? 0;
    }),
    revenueGrowth: computed(() => {
      const data = revenueData();
      if (data.length < 2) return 0;
      const current = data[data.length - 1].revenue;
      const previous = data[data.length - 2].revenue;
      return Math.round(((current - previous) / previous) * 100 * 10) / 10;
    }),
    recentActivities: computed(() => activities().slice(0, 8)),
  })),
  withMethods((store) => ({
    loadDashboardData(): Promise<void> {
      patchState(store, { loading: true, error: null });

      // Simulate API call with realistic delay
      return new Promise((resolve) => {
        setTimeout(() => {
          patchState(store, {
            kpis: MOCK_KPI_METRICS,
            revenueData: MOCK_REVENUE_DATA,
            categoryData: MOCK_CATEGORY_DATA,
            distributionData: MOCK_DISTRIBUTION_DATA,
            activities: MOCK_ACTIVITIES,
            loading: false,
          });
          resolve();
        }, 600);
      });
    },
  })),
);
