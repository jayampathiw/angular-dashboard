import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { UserTableComponent } from '../components/user-table/user-table.component';
import { UserFiltersComponent } from '../components/user-filters/user-filters.component';
import {
  UserDialogComponent,
  UserDialogData,
  UserDialogResult,
} from '../components/user-dialog/user-dialog.component';
import { UsersStore } from '../store/users.store';
import { UserFilter, UserItem } from '../models/users.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    UserTableComponent,
    UserFiltersComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  readonly store = inject(UsersStore);
  private readonly dialog = inject(MatDialog);

  onFilterChanged(patch: Partial<UserFilter>): void {
    this.store.setFilter(patch);
  }

  onFiltersCleared(): void {
    this.store.clearFilters();
  }

  onSortChanged(event: { active: string; direction: 'asc' | 'desc' }): void {
    this.store.setSort(event.active as keyof UserItem, event.direction);
  }

  onPageChanged(event: PageEvent): void {
    if (event.pageSize !== this.store.table().pageSize) {
      this.store.setPageSize(event.pageSize);
    } else {
      this.store.setPage(event.pageIndex);
    }
  }

  onSelectionToggled(id: string): void {
    this.store.toggleSelection(id);
  }

  onPageSelectionToggled(): void {
    this.store.togglePageSelection();
  }

  openCreateDialog(): void {
    const data: UserDialogData = { mode: 'create' };
    const ref = this.dialog.open(UserDialogComponent, {
      data,
      width: '520px',
    });

    ref.afterClosed().subscribe((result: UserDialogResult | undefined) => {
      if (result) {
        this.store.createUser(result);
      }
    });
  }

  onEditRequested(user: UserItem): void {
    const data: UserDialogData = { mode: 'edit', user };
    const ref = this.dialog.open(UserDialogComponent, {
      data,
      width: '520px',
    });

    ref.afterClosed().subscribe((result: UserDialogResult | undefined) => {
      if (result) {
        this.store.updateUser(user.id, result);
      }
    });
  }

  onDeleteRequested(user: UserItem): void {
    this.store.deleteUser(user.id);
  }

  onDeleteSelected(): void {
    this.store.deleteSelected();
  }
}
