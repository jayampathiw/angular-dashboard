import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ComponentRef } from '@angular/core';
import { ActivityFeedComponent } from './activity-feed.component';
import { ActivityItem } from '../../models/dashboard.model';

describe('ActivityFeedComponent', () => {
  let component: ActivityFeedComponent;
  let componentRef: ComponentRef<ActivityFeedComponent>;
  let fixture: ComponentFixture<ActivityFeedComponent>;

  const mockItems: ActivityItem[] = [
    {
      id: '1',
      user: { name: 'Alice', initials: 'AL', color: '#0078D4' },
      action: 'created',
      target: 'Project Alpha',
      timestamp: '2 minutes ago',
      icon: 'add_circle',
    },
    {
      id: '2',
      user: { name: 'Bob', initials: 'BO', color: '#107C10' },
      action: 'updated',
      target: 'Task 42',
      timestamp: '5 minutes ago',
      icon: 'edit',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActivityFeedComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ActivityFeedComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('items', mockItems);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should receive items input', () => {
    expect(component.items()).toHaveLength(2);
  });

  it('should have correct first item data', () => {
    expect(component.items()[0].user.name).toBe('Alice');
    expect(component.items()[0].action).toBe('created');
  });

  it('should handle empty items', () => {
    componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(component.items()).toHaveLength(0);
  });
});
