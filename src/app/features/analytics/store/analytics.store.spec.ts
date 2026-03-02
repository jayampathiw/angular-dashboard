import { TestBed } from '@angular/core/testing';
import { AnalyticsStore } from './analytics.store';
import {
  MOCK_ANALYTICS_KPIS,
  MOCK_TRAFFIC_DATA,
  MOCK_CHANNEL_DATA,
  MOCK_DEVICE_DATA,
} from '../data/analytics-mock.data';

describe('AnalyticsStore', () => {
  let store: InstanceType<typeof AnalyticsStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    store = TestBed.inject(AnalyticsStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty data arrays', () => {
      expect(store.kpis()).toEqual([]);
      expect(store.trafficData()).toEqual([]);
      expect(store.channelData()).toEqual([]);
      expect(store.deviceData()).toEqual([]);
    });

    it('should not be loading', () => {
      expect(store.loading()).toBe(false);
    });

    it('should have zero totalSessions initially', () => {
      expect(store.totalSessions()).toBe(0);
    });
  });

  describe('loadAnalytics', () => {
    it('should set loading to true', () => {
      store.loadAnalytics();
      expect(store.loading()).toBe(true);
    });

    it('should load mock data after delay', async () => {
      const promise = store.loadAnalytics();
      jest.advanceTimersByTime(400);
      await promise;

      expect(store.kpis()).toEqual(MOCK_ANALYTICS_KPIS);
      expect(store.trafficData()).toEqual(MOCK_TRAFFIC_DATA);
      expect(store.channelData()).toEqual(MOCK_CHANNEL_DATA);
      expect(store.deviceData()).toEqual(MOCK_DEVICE_DATA);
    });

    it('should set loading to false after data loads', async () => {
      const promise = store.loadAnalytics();
      jest.advanceTimersByTime(400);
      await promise;

      expect(store.loading()).toBe(false);
    });
  });

  describe('computed values', () => {
    beforeEach(async () => {
      const promise = store.loadAnalytics();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should compute totalSessions from channel data', () => {
      const expectedTotal = MOCK_CHANNEL_DATA.reduce(
        (sum, c) => sum + c.sessions,
        0,
      );
      expect(store.totalSessions()).toBe(expectedTotal);
    });

    it('should have correct number of KPIs', () => {
      expect(store.kpis().length).toBe(MOCK_ANALYTICS_KPIS.length);
    });

    it('should have correct number of traffic data points', () => {
      expect(store.trafficData().length).toBe(MOCK_TRAFFIC_DATA.length);
    });
  });
});
