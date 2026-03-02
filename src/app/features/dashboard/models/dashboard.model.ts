export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: 'number' | 'currency' | 'percent';
  icon: string;
  trend: 'up' | 'down' | 'flat';
  trendValue: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface CategoryDataPoint {
  category: string;
  value: number;
  color: string;
}

export interface DistributionSegment {
  source: string;
  percentage: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  user: ActivityUser;
  action: string;
  target: string;
  timestamp: string;
  icon: string;
}

export interface ActivityUser {
  name: string;
  initials: string;
  color: string;
}
