import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';
import {
  AnalyticsKpi,
  TrafficDataPoint,
  ChannelData,
  DeviceData,
} from '../models/analytics.model';
import {
  MOCK_ANALYTICS_KPIS,
  MOCK_TRAFFIC_DATA,
  MOCK_CHANNEL_DATA,
  MOCK_DEVICE_DATA,
} from '../data/analytics-mock.data';

interface AnalyticsState {
  kpis: AnalyticsKpi[];
  trafficData: TrafficDataPoint[];
  channelData: ChannelData[];
  deviceData: DeviceData[];
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  kpis: [],
  trafficData: [],
  channelData: [],
  deviceData: [],
  loading: false,
  error: null,
};

export const AnalyticsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ channelData }) => ({
    totalSessions: computed(() =>
      channelData().reduce((sum, c) => sum + c.sessions, 0),
    ),
  })),

  withMethods((store) => ({
    loadAnalytics(): Promise<void> {
      patchState(store, { loading: true, error: null });

      return new Promise((resolve) => {
        setTimeout(() => {
          patchState(store, {
            kpis: MOCK_ANALYTICS_KPIS,
            trafficData: MOCK_TRAFFIC_DATA,
            channelData: MOCK_CHANNEL_DATA,
            deviceData: MOCK_DEVICE_DATA,
            loading: false,
          });
          resolve();
        }, 400);
      });
    },
  })),
);
