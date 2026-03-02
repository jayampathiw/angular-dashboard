import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let routerEvents$: Subject<NavigationEnd>;

  beforeEach(() => {
    routerEvents$ = new Subject<NavigationEnd>();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: { events: routerEvents$.asObservable() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            root: {
              children: [
                {
                  snapshot: {
                    url: [{ path: 'dashboard' }],
                    data: { breadcrumb: 'Dashboard' },
                  },
                  children: [],
                },
              ],
            },
          },
        },
      ],
    });

    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty breadcrumbs', () => {
    expect(service.breadcrumbsList()).toEqual([]);
  });

  it('should build breadcrumbs on navigation', () => {
    routerEvents$.next(new NavigationEnd(1, '/dashboard', '/dashboard'));

    const breadcrumbs = service.breadcrumbsList();
    expect(breadcrumbs.length).toBe(1);
    expect(breadcrumbs[0].label).toBe('Dashboard');
    expect(breadcrumbs[0].url).toBe('/dashboard');
  });
});
