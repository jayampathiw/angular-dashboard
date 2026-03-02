import {
  AnalyticsKpi,
  TrafficDataPoint,
  ChannelData,
  DeviceData,
} from '../models/analytics.model';

export const MOCK_ANALYTICS_KPIS: AnalyticsKpi[] = [
  {
    id: 'page-views',
    title: 'Page Views',
    value: 284620,
    format: 'number',
    trend: 12.5,
    icon: 'visibility',
  },
  {
    id: 'visitors',
    title: 'Unique Visitors',
    value: 64830,
    format: 'number',
    trend: 8.3,
    icon: 'people',
  },
  {
    id: 'bounce-rate',
    title: 'Bounce Rate',
    value: 34.2,
    format: 'percent',
    trend: -2.1,
    icon: 'trending_down',
  },
  {
    id: 'avg-session',
    title: 'Avg. Session',
    value: 245,
    format: 'duration',
    trend: 5.7,
    icon: 'timer',
  },
];

export const MOCK_TRAFFIC_DATA: TrafficDataPoint[] = [
  { date: 'Jan', visitors: 4200, pageViews: 18400 },
  { date: 'Feb', visitors: 4800, pageViews: 20100 },
  { date: 'Mar', visitors: 5100, pageViews: 21800 },
  { date: 'Apr', visitors: 4700, pageViews: 19600 },
  { date: 'May', visitors: 5400, pageViews: 23500 },
  { date: 'Jun', visitors: 5900, pageViews: 25200 },
  { date: 'Jul', visitors: 5600, pageViews: 24100 },
  { date: 'Aug', visitors: 6200, pageViews: 27800 },
  { date: 'Sep', visitors: 5800, pageViews: 25600 },
  { date: 'Oct', visitors: 6500, pageViews: 29400 },
  { date: 'Nov', visitors: 6100, pageViews: 27200 },
  { date: 'Dec', visitors: 6800, pageViews: 30100 },
];

export const MOCK_CHANNEL_DATA: ChannelData[] = [
  { channel: 'Organic Search', sessions: 28400, color: '#0078D4' },
  { channel: 'Direct', sessions: 18200, color: '#107C10' },
  { channel: 'Social Media', sessions: 12600, color: '#E86C44' },
  { channel: 'Referral', sessions: 8400, color: '#7B1FA2' },
  { channel: 'Email', sessions: 5200, color: '#C2185B' },
];

export const MOCK_DEVICE_DATA: DeviceData[] = [
  { device: 'Desktop', percentage: 52, color: '#0078D4' },
  { device: 'Mobile', percentage: 38, color: '#107C10' },
  { device: 'Tablet', percentage: 10, color: '#E86C44' },
];
