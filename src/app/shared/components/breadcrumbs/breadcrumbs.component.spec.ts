import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Breadcrumb } from '../../../core/models/breadcrumb.model';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  const breadcrumbsSignal = signal<Breadcrumb[]>([]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent],
      providers: [
        {
          provide: BreadcrumbService,
          useValue: { breadcrumbsList: breadcrumbsSignal },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(BreadcrumbsComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    const fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should expose breadcrumbs from service', () => {
    breadcrumbsSignal.set([
      { label: 'Home', url: '/' },
      { label: 'Dashboard', url: '/dashboard' },
    ]);

    expect(component.breadcrumbs().length).toBe(2);
    expect(component.breadcrumbs()[0].label).toBe('Home');
  });
});
