export interface AnalyticsKpi {
  id: string;
  title: string;
  value: number;
  format: 'number' | 'percent' | 'duration';
  trend: number;
  icon: string;
}

export interface TrafficDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
}

export interface ChannelData {
  channel: string;
  sessions: number;
  color: string;
}

export interface DeviceData {
  device: string;
  percentage: number;
  color: string;
}
