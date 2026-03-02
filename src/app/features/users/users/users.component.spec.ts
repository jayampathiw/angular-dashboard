import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UsersComponent } from './users.component';
import { UsersStore } from '../store/users.store';
import { Role } from '../../../core/models/auth.model';
import { UserItem } from '../models/users.model';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let store: InstanceType<typeof UsersStore>;
  let dialogSpy: jest.Mocked<MatDialog>;

  const mockUser: UserItem = {
    id: 'usr-001',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'JD',
    role: Role.Editor,
    status: 'active',
    department: 'Engineering',
    createdAt: '2025-01-01',
    lastLogin: '2025-01-15',
  };

  beforeEach(() => {
    jest.useFakeTimers();

    dialogSpy = {
      open: jest.fn().mockReturnValue({
        afterClosed: () => of(undefined),
      } as unknown as MatDialogRef<unknown>),
    } as unknown as jest.Mocked<MatDialog>;

    TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [{ provide: MatDialog, useValue: dialogSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    store = TestBed.inject(UsersStore);
    const fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should delegate filter to store', () => {
    const spy = jest.spyOn(store, 'setFilter');
    component.onFilterChanged({ search: 'test' });
    expect(spy).toHaveBeenCalledWith({ search: 'test' });
  });

  it('should delegate clear filters to store', () => {
    const spy = jest.spyOn(store, 'clearFilters');
    component.onFiltersCleared();
    expect(spy).toHaveBeenCalled();
  });

  it('should delegate sort to store', () => {
    const spy = jest.spyOn(store, 'setSort');
    component.onSortChanged({ active: 'email', direction: 'asc' });
    expect(spy).toHaveBeenCalledWith('email', 'asc');
  });

  it('should delegate page change to store', () => {
    const spy = jest.spyOn(store, 'setPage');
    component.onPageChanged({
      pageIndex: 2,
      pageSize: 10,
      length: 50,
      previousPageIndex: 1,
    });
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should delegate selection toggle', () => {
    const spy = jest.spyOn(store, 'toggleSelection');
    component.onSelectionToggled('usr-001');
    expect(spy).toHaveBeenCalledWith('usr-001');
  });

  it('should delegate page selection toggle', () => {
    const spy = jest.spyOn(store, 'togglePageSelection');
    component.onPageSelectionToggled();
    expect(spy).toHaveBeenCalled();
  });

  it('should delegate delete', () => {
    const spy = jest.spyOn(store, 'deleteUser');
    component.onDeleteRequested(mockUser);
    expect(spy).toHaveBeenCalledWith('usr-001');
  });

  it('should delegate delete selected', () => {
    const spy = jest.spyOn(store, 'deleteSelected');
    component.onDeleteSelected();
    expect(spy).toHaveBeenCalled();
  });

  it('should open create dialog', () => {
    component.openCreateDialog();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should create user when dialog returns result', () => {
    const result = {
      email: 'new@user.com',
      firstName: 'New',
      lastName: 'User',
      role: Role.Viewer,
      status: 'active' as const,
      department: 'Marketing',
    };

    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(result),
    } as unknown as MatDialogRef<unknown>);

    const spy = jest.spyOn(store, 'createUser');
    component.openCreateDialog();

    expect(spy).toHaveBeenCalledWith(result);
  });

  it('should open edit dialog with user data', () => {
    component.onEditRequested(mockUser);
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should update user when edit dialog returns result', () => {
    const result = { firstName: 'Updated' };

    dialogSpy.open.mockReturnValue({
      afterClosed: () => of(result),
    } as unknown as MatDialogRef<unknown>);

    const spy = jest.spyOn(store, 'updateUser');
    component.onEditRequested(mockUser);

    expect(spy).toHaveBeenCalledWith('usr-001', result);
  });
});
