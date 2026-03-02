import { TestBed } from '@angular/core/testing';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start expanded', () => {
    expect(service.isCollapsed()).toBe(false);
  });

  it('should toggle collapsed state', () => {
    service.toggle();
    expect(service.isCollapsed()).toBe(true);

    service.toggle();
    expect(service.isCollapsed()).toBe(false);
  });

  it('should collapse', () => {
    service.collapse();
    expect(service.isCollapsed()).toBe(true);
  });

  it('should expand', () => {
    service.collapse();
    service.expand();
    expect(service.isCollapsed()).toBe(false);
  });

  it('should keep collapsed state when collapsing twice', () => {
    service.collapse();
    service.collapse();
    expect(service.isCollapsed()).toBe(true);
  });
});
