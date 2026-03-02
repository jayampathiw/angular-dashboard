import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarService } from '../../../core/services/sidebar.service';
import { NAV_ITEMS } from '../../../core/models/navigation.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private sidebarService = inject(SidebarService);

  navItems = NAV_ITEMS;
  isCollapsed = this.sidebarService.isCollapsed;

  toggleCollapse(): void {
    this.sidebarService.toggle();
  }
}
