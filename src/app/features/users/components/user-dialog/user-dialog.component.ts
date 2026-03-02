import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Role } from '../../../../core/models/auth.model';
import { UserItem, UserStatus } from '../../models/users.model';

export interface UserDialogData {
  mode: 'create' | 'edit';
  user?: UserItem;
}

export interface UserDialogResult {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  department: string;
  status: UserStatus;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);

  readonly isEdit = this.data.mode === 'edit';

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

  readonly departments = [
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Sales',
    'Finance',
    'Support',
  ];

  readonly form = this.fb.nonNullable.group({
    firstName: [this.data.user?.firstName ?? '', Validators.required],
    lastName: [this.data.user?.lastName ?? '', Validators.required],
    email: [this.data.user?.email ?? '', [Validators.required, Validators.email]],
    role: [this.data.user?.role ?? Role.Viewer, Validators.required],
    department: [this.data.user?.department ?? '', Validators.required],
    status: [this.data.user?.status ?? ('active' as UserStatus), Validators.required],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
