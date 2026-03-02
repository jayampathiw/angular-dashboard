import {
  KpiMetric,
  RevenueDataPoint,
  CategoryDataPoint,
  DistributionSegment,
  ActivityItem,
} from '../models/dashboard.model';

export const MOCK_KPI_METRICS: KpiMetric[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: 284521,
    previousValue: 252908,
    format: 'currency',
    icon: 'attach_money',
    trend: 'up',
    trendValue: 12.5,
  },
  {
    id: 'users',
    label: 'Active Users',
    value: 14832,
    previousValue: 13708,
    format: 'number',
    icon: 'group',
    trend: 'up',
    trendValue: 8.2,
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: 3456,
    previousValue: 3269,
    format: 'number',
    icon: 'shopping_cart',
    trend: 'up',
    trendValue: 5.7,
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: 3.24,
    previousValue: 3.18,
    format: 'percent',
    icon: 'trending_up',
    trend: 'up',
    trendValue: 1.9,
  },
];

export const MOCK_REVENUE_DATA: RevenueDataPoint[] = [
  { month: 'Jan', revenue: 182000, expenses: 145000 },
  { month: 'Feb', revenue: 195000, expenses: 152000 },
  { month: 'Mar', revenue: 215000, expenses: 160000 },
  { month: 'Apr', revenue: 198000, expenses: 155000 },
  { month: 'May', revenue: 228000, expenses: 168000 },
  { month: 'Jun', revenue: 245000, expenses: 172000 },
  { month: 'Jul', revenue: 238000, expenses: 170000 },
  { month: 'Aug', revenue: 262000, expenses: 180000 },
  { month: 'Sep', revenue: 275000, expenses: 188000 },
  { month: 'Oct', revenue: 292000, expenses: 195000 },
  { month: 'Nov', revenue: 305000, expenses: 200000 },
  { month: 'Dec', revenue: 285000, expenses: 192000 },
];

export const MOCK_CATEGORY_DATA: CategoryDataPoint[] = [
  { category: 'Electronics', value: 45200, color: '#0078D4' },
  { category: 'Clothing', value: 32800, color: '#5B2F91' },
  { category: 'Home & Garden', value: 18500, color: '#0099BC' },
  { category: 'Sports', value: 12400, color: '#E86C44' },
  { category: 'Books', value: 8600, color: '#10893E' },
];

export const MOCK_DISTRIBUTION_DATA: DistributionSegment[] = [
  { source: 'Direct', percentage: 35, color: '#0078D4' },
  { source: 'Organic Search', percentage: 28, color: '#5B2F91' },
  { source: 'Social Media', percentage: 20, color: '#0099BC' },
  { source: 'Referral', percentage: 12, color: '#E86C44' },
  { source: 'Email', percentage: 5, color: '#10893E' },
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-001',
    user: { name: 'Sarah Chen', initials: 'SC', color: '#0078D4' },
    action: 'completed order',
    target: '#ORD-4521',
    timestamp: '2 min ago',
    icon: 'check_circle',
  },
  {
    id: 'act-002',
    user: { name: 'James Rodriguez', initials: 'JR', color: '#5B2F91' },
    action: 'updated inventory for',
    target: 'MacBook Pro 16"',
    timestamp: '15 min ago',
    icon: 'inventory',
  },
  {
    id: 'act-003',
    user: { name: 'Emily Watson', initials: 'EW', color: '#0099BC' },
    action: 'registered as',
    target: 'new user',
    timestamp: '32 min ago',
    icon: 'person_add',
  },
  {
    id: 'act-004',
    user: { name: 'Michael Park', initials: 'MP', color: '#E86C44' },
    action: 'submitted review for',
    target: 'Wireless Earbuds',
    timestamp: '1 hour ago',
    icon: 'rate_review',
  },
  {
    id: 'act-005',
    user: { name: 'Lisa Thompson', initials: 'LT', color: '#10893E' },
    action: 'processed refund for',
    target: '#ORD-4498',
    timestamp: '2 hours ago',
    icon: 'currency_exchange',
  },
  {
    id: 'act-006',
    user: { name: 'David Kim', initials: 'DK', color: '#D83B01' },
    action: 'added new product',
    target: 'Smart Watch Pro',
    timestamp: '3 hours ago',
    icon: 'add_circle',
  },
  {
    id: 'act-007',
    user: { name: 'Anna Kowalski', initials: 'AK', color: '#8764B8' },
    action: 'resolved support ticket',
    target: '#TKT-892',
    timestamp: '4 hours ago',
    icon: 'support_agent',
  },
  {
    id: 'act-008',
    user: { name: 'Robert Singh', initials: 'RS', color: '#008272' },
    action: 'exported report for',
    target: 'Q4 2025 Sales',
    timestamp: '5 hours ago',
    icon: 'download',
  },
];
