import { TestBed } from '@angular/core/testing';
import { analyticsResolver } from './analytics.resolver';
import { AnalyticsStore } from './analytics.store';

describe('analyticsResolver', () => {
  let mockStore: { loadAnalytics: jest.Mock };

  beforeEach(() => {
    mockStore = {
      loadAnalytics: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: AnalyticsStore, useValue: mockStore }],
    });
  });

  it('should call loadAnalytics', async () => {
    await TestBed.runInInjectionContext(() =>
      analyticsResolver({} as any, {} as any),
    );
    expect(mockStore.loadAnalytics).toHaveBeenCalled();
  });

  it('should return true after data loads', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      analyticsResolver({} as any, {} as any),
    );
    expect(result).toBe(true);
  });
});
