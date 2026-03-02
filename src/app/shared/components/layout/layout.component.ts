import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { SidebarService } from '../../../core/services/sidebar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MOBILE = '(max-width: 767px)';
const TABLET = '(min-width: 768px) and (max-width: 1023px)';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    FooterComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private sidebarService = inject(SidebarService);
  private destroyRef = inject(DestroyRef);

  isMobile = signal(false);
  isTablet = signal(false);

  sidenavMode = computed(() => (this.isMobile() ? 'over' : 'side'));
  sidenavOpened = signal(true);
  isCollapsed = this.sidebarService.isCollapsed;

  ngOnInit(): void {
    this.breakpointObserver
      .observe([MOBILE, TABLET])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        const isMobile = result.breakpoints[MOBILE];
        const isTablet = result.breakpoints[TABLET];

        this.isMobile.set(isMobile);
        this.isTablet.set(isTablet);

        if (isMobile) {
          this.sidenavOpened.set(false);
          // Keep sidebar expanded so it shows full-width when the drawer opens
          this.sidebarService.expand();
        } else if (isTablet) {
          this.sidenavOpened.set(true);
          this.sidebarService.collapse();
        } else {
          this.sidenavOpened.set(true);
          this.sidebarService.expand();
        }
      });
  }

  toggleSidenav(): void {
    if (this.isMobile()) {
      this.sidenavOpened.update((v) => !v);
    } else {
      this.sidebarService.toggle();
    }
  }
}
