import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { SidebarService } from '../../../core/services/sidebar.service';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let sidebarService: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA],
    });

    sidebarService = TestBed.inject(SidebarService);
    const fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should expose nav items', () => {
    expect(component.navItems).toBeDefined();
    expect(component.navItems.length).toBeGreaterThan(0);
  });

  it('should expose isCollapsed from service', () => {
    expect(component.isCollapsed()).toBe(false);
  });

  it('should toggle sidebar via service', () => {
    const spy = jest.spyOn(sidebarService, 'toggle');
    component.toggleCollapse();
    expect(spy).toHaveBeenCalled();
  });
});
