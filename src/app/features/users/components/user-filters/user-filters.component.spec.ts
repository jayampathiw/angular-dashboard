import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserFiltersComponent } from './user-filters.component';
import { Role } from '../../../../core/models/auth.model';

describe('UserFiltersComponent', () => {
  let component: UserFiltersComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserFiltersComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(UserFiltersComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have role options', () => {
    expect(component.roles.length).toBe(3);
  });

  it('should have status options', () => {
    expect(component.statuses.length).toBe(3);
  });

  it('should emit filter on debounced search', fakeAsync(() => {
    const spy = jest.fn();
    component.filterChanged.subscribe(spy);

    component.onSearchInput('john');
    tick(300);

    expect(spy).toHaveBeenCalledWith({ search: 'john' });
  }));

  it('should emit filter on role change immediately', () => {
    const spy = jest.fn();
    component.filterChanged.subscribe(spy);

    component.onRoleChange(Role.Admin);

    expect(spy).toHaveBeenCalledWith({ role: Role.Admin });
    expect(component.roleValue()).toBe(Role.Admin);
  });

  it('should emit filter on status change immediately', () => {
    const spy = jest.fn();
    component.filterChanged.subscribe(spy);

    component.onStatusChange('active');

    expect(spy).toHaveBeenCalledWith({ status: 'active' });
    expect(component.statusValue()).toBe('active');
  });

  it('should clear all filters', () => {
    const spy = jest.fn();
    component.filtersCleared.subscribe(spy);

    component.onRoleChange(Role.Admin);
    component.onStatusChange('active');
    component.onSearchInput('test');

    component.clearFilters();

    expect(component.searchValue()).toBe('');
    expect(component.roleValue()).toBe('');
    expect(component.statusValue()).toBe('');
    expect(spy).toHaveBeenCalled();
  });
});
