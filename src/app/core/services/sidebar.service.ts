import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private collapsed = signal<boolean>(false);

  isCollapsed = this.collapsed.asReadonly();

  toggle(): void {
    this.collapsed.update((v) => !v);
  }

  collapse(): void {
    this.collapsed.set(true);
  }

  expand(): void {
    this.collapsed.set(false);
  }
}
