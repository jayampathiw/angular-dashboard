import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  department: string;
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  readonly profile = input.required<ProfileData>();
  readonly profileSaved = output<ProfileData>();

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    department: [''],
  });

  ngOnInit(): void {
    this.form.patchValue(this.profile());
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.profileSaved.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
