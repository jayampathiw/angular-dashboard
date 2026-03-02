import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserItem } from '../../models/users.model';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserTableComponent {
  readonly users = input.required<UserItem[]>();
  readonly totalCount = input.required<number>();
  readonly pageIndex = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly selectedIds = input.required<Set<string>>();
  readonly allPageSelected = input.required<boolean>();

  readonly sortChanged = output<{ active: string; direction: 'asc' | 'desc' }>();
  readonly pageChanged = output<PageEvent>();
  readonly selectionToggled = output<string>();
  readonly pageSelectionToggled = output<void>();
  readonly editRequested = output<UserItem>();
  readonly deleteRequested = output<UserItem>();
  readonly statusChanged = output<{ id: string; status: 'active' | 'inactive' | 'suspended' }>();

  readonly displayedColumns = [
    'select',
    'name',
    'email',
    'role',
    'department',
    'status',
    'lastLogin',
    'actions',
  ];

  readonly roleConfig: Record<string, { label: string; class: string }> = {
    admin: { label: 'Admin', class: 'role-admin' },
    editor: { label: 'Editor', class: 'role-editor' },
    viewer: { label: 'Viewer', class: 'role-viewer' },
  };

  readonly statusConfig: Record<string, { label: string; class: string }> = {
    active: { label: 'Active', class: 'status-active' },
    inactive: { label: 'Inactive', class: 'status-inactive' },
    suspended: { label: 'Suspended', class: 'status-suspended' },
  };

  private readonly avatarColors = [
    '#1976d2', '#388e3c', '#e64a19', '#7b1fa2', '#c2185b', '#00796b',
  ];

  getAvatarColor(id: string): string {
    const hash = id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return this.avatarColors[hash % this.avatarColors.length];
  }

  isSelected(id: string): boolean {
    return this.selectedIds().has(id);
  }

  onSortChange(sort: Sort): void {
    if (sort.direction) {
      this.sortChanged.emit({
        active: sort.active,
        direction: sort.direction as 'asc' | 'desc',
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageChanged.emit(event);
  }
}
