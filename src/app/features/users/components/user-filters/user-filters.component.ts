import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Role } from '../../../../core/models/auth.model';
import { UserFilter, UserStatus } from '../../models/users.model';

@Component({
  selector: 'app-user-filters',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './user-filters.component.html',
  styleUrl: './user-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFiltersComponent implements OnDestroy {
  readonly filterChanged = output<Partial<UserFilter>>();
  readonly filtersCleared = output<void>();

  readonly searchValue = signal('');
  readonly roleValue = signal<Role | ''>('');
  readonly statusValue = signal<UserStatus | ''>('');

  readonly roles = [
    { value: Role.Admin, label: 'Admin' },
    { value: Role.Editor, label: 'Editor' },
    { value: Role.Viewer, label: 'Viewer' },
  ];

  readonly statuses = [
    { value: 'active' as UserStatus, label: 'Active' },
    { value: 'inactive' as UserStatus, label: 'Inactive' },
    { value: 'suspended' as UserStatus, label: 'Suspended' },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  constructor() {
    this.search$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => this.filterChanged.emit({ search }));
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
    this.search$.next(value);
  }

  onRoleChange(role: Role | ''): void {
    this.roleValue.set(role);
    this.filterChanged.emit({ role });
  }

  onStatusChange(status: UserStatus | ''): void {
    this.statusValue.set(status);
    this.filterChanged.emit({ status });
  }

  clearFilters(): void {
    this.searchValue.set('');
    this.roleValue.set('');
    this.statusValue.set('');
    this.filtersCleared.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
