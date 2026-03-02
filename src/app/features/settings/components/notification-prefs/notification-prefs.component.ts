import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

export interface NotificationPrefs {
  emailNotifications: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  marketingEmails: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
}

@Component({
  selector: 'app-notification-prefs',
  standalone: true,
  imports: [MatSlideToggleModule, MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './notification-prefs.component.html',
  styleUrl: './notification-prefs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPrefsComponent {
  readonly prefs = input.required<NotificationPrefs>();
  readonly prefsChanged = output<Partial<NotificationPrefs>>();

  onToggle(key: keyof NotificationPrefs, value: boolean): void {
    this.prefsChanged.emit({ [key]: value });
  }

  onFrequencyChange(frequency: NotificationPrefs['frequency']): void {
    this.prefsChanged.emit({ frequency });
  }
}
