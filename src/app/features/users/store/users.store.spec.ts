import { TestBed } from '@angular/core/testing';
import { UsersStore } from './users.store';
import { MOCK_USERS } from '../data/users-mock.data';
import { Role } from '../../../core/models/auth.model';

describe('UsersStore', () => {
  let store: InstanceType<typeof UsersStore>;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    store = TestBed.inject(UsersStore);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have empty users', () => {
      expect(store.users()).toEqual([]);
    });

    it('should have default filters', () => {
      expect(store.filter()).toEqual({ search: '', role: '', status: '' });
    });

    it('should have default table state', () => {
      expect(store.table()).toEqual({
        pageIndex: 0,
        pageSize: 10,
        sortBy: 'lastName',
        sortDirection: 'asc',
      });
    });
  });

  describe('loadUsers', () => {
    it('should set loading to true', () => {
      store.loadUsers();
      expect(store.loading()).toBe(true);
    });

    it('should load mock users after delay', async () => {
      const promise = store.loadUsers();
      jest.advanceTimersByTime(400);
      await promise;

      expect(store.users().length).toBe(MOCK_USERS.length);
      expect(store.loading()).toBe(false);
    });
  });

  describe('filtering', () => {
    beforeEach(async () => {
      const promise = store.loadUsers();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should filter by search term', () => {
      const firstUser = MOCK_USERS[0];
      store.setFilter({ search: firstUser.firstName });

      expect(
        store.filteredUsers().some((u) => u.firstName === firstUser.firstName),
      ).toBe(true);
    });

    it('should filter by role', () => {
      store.setFilter({ role: Role.Admin });

      const admins = store.filteredUsers();
      expect(admins.every((u) => u.role === Role.Admin)).toBe(true);
    });

    it('should filter by status', () => {
      store.setFilter({ status: 'active' });

      const active = store.filteredUsers();
      expect(active.every((u) => u.status === 'active')).toBe(true);
    });

    it('should reset page when filtering', () => {
      store.setPage(2);
      store.setFilter({ search: 'test' });

      expect(store.table().pageIndex).toBe(0);
    });

    it('should clear all filters', () => {
      store.setFilter({ search: 'test', role: Role.Admin, status: 'active' });
      store.clearFilters();

      expect(store.filter()).toEqual({ search: '', role: '', status: '' });
    });
  });

  describe('sorting', () => {
    beforeEach(async () => {
      const promise = store.loadUsers();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should sort users ascending by default', () => {
      const sorted = store.sortedUsers();
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].lastName.localeCompare(sorted[i - 1].lastName)).toBeGreaterThanOrEqual(0);
      }
    });

    it('should sort users descending', () => {
      store.setSort('lastName', 'desc');

      const sorted = store.sortedUsers();
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i - 1].lastName.localeCompare(sorted[i].lastName)).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('pagination', () => {
    beforeEach(async () => {
      const promise = store.loadUsers();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should paginate to default page size', () => {
      expect(store.paginatedUsers().length).toBeLessThanOrEqual(10);
    });

    it('should navigate to next page', () => {
      const firstPageUser = store.paginatedUsers()[0];
      store.setPage(1);

      const secondPageUser = store.paginatedUsers()[0];
      expect(firstPageUser.id).not.toBe(secondPageUser?.id);
    });

    it('should change page size', () => {
      store.setPageSize(5);

      expect(store.paginatedUsers().length).toBeLessThanOrEqual(5);
      expect(store.table().pageIndex).toBe(0);
    });

    it('should clear selection when changing page', () => {
      store.toggleSelection(store.paginatedUsers()[0].id);
      store.setPage(1);

      expect(store.selectedCount()).toBe(0);
    });
  });

  describe('selection', () => {
    beforeEach(async () => {
      const promise = store.loadUsers();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should toggle individual selection', () => {
      const userId = store.paginatedUsers()[0].id;
      store.toggleSelection(userId);

      expect(store.selectedCount()).toBe(1);
      expect(store.hasSelection()).toBe(true);
    });

    it('should deselect when toggled again', () => {
      const userId = store.paginatedUsers()[0].id;
      store.toggleSelection(userId);
      store.toggleSelection(userId);

      expect(store.selectedCount()).toBe(0);
      expect(store.hasSelection()).toBe(false);
    });

    it('should select all on page', () => {
      store.togglePageSelection();

      expect(store.allPageSelected()).toBe(true);
      expect(store.selectedCount()).toBe(store.paginatedUsers().length);
    });

    it('should deselect all when all are selected', () => {
      store.togglePageSelection();
      store.togglePageSelection();

      expect(store.selectedCount()).toBe(0);
    });

    it('should clear selection', () => {
      store.togglePageSelection();
      store.clearSelection();

      expect(store.selectedCount()).toBe(0);
    });
  });

  describe('CRUD operations', () => {
    beforeEach(async () => {
      const promise = store.loadUsers();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should create a new user', () => {
      const initialCount = store.totalCount();

      store.createUser({
        email: 'new@user.com',
        firstName: 'New',
        lastName: 'User',
        role: Role.Viewer,
        status: 'active',
        department: 'Engineering',
      });

      expect(store.totalCount()).toBe(initialCount + 1);
      expect(store.users()[0].email).toBe('new@user.com');
    });

    it('should update a user', () => {
      const userId = store.users()[0].id;
      store.updateUser(userId, { firstName: 'Updated' });

      const updated = store.users().find((u) => u.id === userId);
      expect(updated?.firstName).toBe('Updated');
    });

    it('should delete a user', () => {
      const initialCount = store.totalCount();
      const userId = store.users()[0].id;

      store.deleteUser(userId);

      expect(store.totalCount()).toBe(initialCount - 1);
      expect(store.users().find((u) => u.id === userId)).toBeUndefined();
    });

    it('should remove deleted user from selection', () => {
      const userId = store.users()[0].id;
      store.toggleSelection(userId);
      store.deleteUser(userId);

      expect(store.selectedCount()).toBe(0);
    });

    it('should delete selected users', () => {
      const ids = store.paginatedUsers().slice(0, 3).map((u) => u.id);
      ids.forEach((id) => store.toggleSelection(id));

      store.deleteSelected();

      ids.forEach((id) => {
        expect(store.users().find((u) => u.id === id)).toBeUndefined();
      });
      expect(store.selectedCount()).toBe(0);
    });

    it('should update user status', () => {
      const userId = store.users()[0].id;
      store.updateStatus(userId, 'suspended');

      const updated = store.users().find((u) => u.id === userId);
      expect(updated?.status).toBe('suspended');
    });
  });

  describe('computed counts', () => {
    beforeEach(async () => {
      const promise = store.loadUsers();
      jest.advanceTimersByTime(400);
      await promise;
    });

    it('should compute totalCount', () => {
      expect(store.totalCount()).toBe(MOCK_USERS.length);
    });

    it('should compute totalFilteredCount', () => {
      store.setFilter({ status: 'active' });

      const expectedCount = MOCK_USERS.filter(
        (u) => u.status === 'active',
      ).length;
      expect(store.totalFilteredCount()).toBe(expectedCount);
    });

    it('should compute activeCount', () => {
      const expectedCount = MOCK_USERS.filter(
        (u) => u.status === 'active',
      ).length;
      expect(store.activeCount()).toBe(expectedCount);
    });

    it('should compute adminCount', () => {
      const expectedCount = MOCK_USERS.filter(
        (u) => u.role === Role.Admin,
      ).length;
      expect(store.adminCount()).toBe(expectedCount);
    });
  });
});
