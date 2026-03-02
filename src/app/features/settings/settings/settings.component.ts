import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ProfileFormComponent, ProfileData } from '../components/profile-form/profile-form.component';
import { NotificationPrefsComponent, NotificationPrefs } from '../components/notification-prefs/notification-prefs.component';
import { AppearanceSettingsComponent } from '../components/appearance-settings/appearance-settings.component';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    ProfileFormComponent,
    NotificationPrefsComponent,
    AppearanceSettingsComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  readonly isDarkMode = this.themeService.isDarkMode;

  readonly profile = signal<ProfileData>({
    firstName: this.authService.currentUser()?.firstName ?? '',
    lastName: this.authService.currentUser()?.lastName ?? '',
    email: this.authService.currentUser()?.email ?? '',
    phone: '+1 (555) 123-4567',
    company: 'Acme Inc.',
    department: 'Engineering',
  });

  readonly notifications = signal<NotificationPrefs>({
    emailNotifications: true,
    securityAlerts: true,
    productUpdates: true,
    marketingEmails: false,
    frequency: 'daily',
  });

  onProfileSaved(data: ProfileData): void {
    this.profile.set(data);
  }

  onNotificationsChanged(patch: Partial<NotificationPrefs>): void {
    this.notifications.update((prefs) => ({ ...prefs, ...patch }));
  }

  onThemeToggled(): void {
    this.themeService.toggleTheme();
  }
}
