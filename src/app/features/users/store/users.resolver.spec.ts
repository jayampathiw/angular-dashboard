import { TestBed } from '@angular/core/testing';
import { usersResolver } from './users.resolver';
import { UsersStore } from './users.store';

describe('usersResolver', () => {
  let mockStore: { loadUsers: jest.Mock };

  beforeEach(() => {
    mockStore = {
      loadUsers: jest.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: UsersStore, useValue: mockStore }],
    });
  });

  it('should call loadUsers', async () => {
    await TestBed.runInInjectionContext(() =>
      usersResolver({} as any, {} as any),
    );
    expect(mockStore.loadUsers).toHaveBeenCalled();
  });

  it('should return true after data loads', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      usersResolver({} as any, {} as any),
    );
    expect(result).toBe(true);
  });
});
