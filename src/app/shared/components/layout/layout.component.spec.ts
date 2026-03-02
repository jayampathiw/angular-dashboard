import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { LayoutComponent } from './layout.component';
import { SidebarService } from '../../../core/services/sidebar.service';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let sidebarService: SidebarService;
  let breakpointSubject: Subject<BreakpointState>;

  beforeEach(() => {
    breakpointSubject = new Subject<BreakpointState>();

    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: () => breakpointSubject.asObservable() },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(LayoutComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    sidebarService = TestBed.inject(SidebarService);
    const fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should default to side mode', () => {
    expect(component.sidenavMode()).toBe('side');
  });

  it('should default to sidenav opened', () => {
    expect(component.sidenavOpened()).toBe(true);
  });

  describe('mobile breakpoint', () => {
    beforeEach(() => {
      breakpointSubject.next({
        matches: true,
        breakpoints: {
          '(max-width: 767px)': true,
          '(min-width: 768px) and (max-width: 1023px)': false,
        },
      });
    });

    it('should set mobile mode', () => {
      expect(component.isMobile()).toBe(true);
    });

    it('should close sidenav', () => {
      expect(component.sidenavOpened()).toBe(false);
    });

    it('should use over mode', () => {
      expect(component.sidenavMode()).toBe('over');
    });

    it('should expand sidebar for full-width drawer', () => {
      expect(sidebarService.isCollapsed()).toBe(false);
    });
  });

  describe('tablet breakpoint', () => {
    beforeEach(() => {
      breakpointSubject.next({
        matches: true,
        breakpoints: {
          '(max-width: 767px)': false,
          '(min-width: 768px) and (max-width: 1023px)': true,
        },
      });
    });

    it('should keep sidenav open', () => {
      expect(component.sidenavOpened()).toBe(true);
    });

    it('should collapse sidebar', () => {
      expect(sidebarService.isCollapsed()).toBe(true);
    });
  });

  describe('desktop breakpoint', () => {
    beforeEach(() => {
      breakpointSubject.next({
        matches: false,
        breakpoints: {
          '(max-width: 767px)': false,
          '(min-width: 768px) and (max-width: 1023px)': false,
        },
      });
    });

    it('should keep sidenav open', () => {
      expect(component.sidenavOpened()).toBe(true);
    });

    it('should expand sidebar', () => {
      expect(sidebarService.isCollapsed()).toBe(false);
    });
  });

  describe('toggleSidenav', () => {
    it('should toggle sidenav opened on mobile', () => {
      breakpointSubject.next({
        matches: true,
        breakpoints: {
          '(max-width: 767px)': true,
          '(min-width: 768px) and (max-width: 1023px)': false,
        },
      });

      component.toggleSidenav();
      expect(component.sidenavOpened()).toBe(true);

      component.toggleSidenav();
      expect(component.sidenavOpened()).toBe(false);
    });

    it('should toggle sidebar collapse on desktop', () => {
      breakpointSubject.next({
        matches: false,
        breakpoints: {
          '(max-width: 767px)': false,
          '(min-width: 768px) and (max-width: 1023px)': false,
        },
      });

      const spy = jest.spyOn(sidebarService, 'toggle');
      component.toggleSidenav();
      expect(spy).toHaveBeenCalled();
    });
  });
});
