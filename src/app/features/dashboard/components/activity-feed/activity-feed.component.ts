import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivityItem } from '../../models/dashboard.model';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './activity-feed.component.html',
  styleUrl: './activity-feed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityFeedComponent {
  readonly items = input.required<ActivityItem[]>();
}
