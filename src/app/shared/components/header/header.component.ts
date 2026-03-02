import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  menuToggle = output<void>();

  themeService = inject(ThemeService);
  authService = inject(AuthService);

  userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '?';
    return (user.firstName[0] + user.lastName[0]).toUpperCase();
  });

  userFullName = computed(() => {
    const user = this.authService.currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });
}
