import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [MatSlideToggleModule, MatIconModule],
  templateUrl: './appearance-settings.component.html',
  styleUrl: './appearance-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppearanceSettingsComponent {
  readonly isDarkMode = input.required<boolean>();
  readonly themeToggled = output<void>();
}
