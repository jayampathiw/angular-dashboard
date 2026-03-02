import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppearanceSettingsComponent } from './appearance-settings.component';

describe('AppearanceSettingsComponent', () => {
  let component: AppearanceSettingsComponent;
  let componentRef: ComponentRef<AppearanceSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppearanceSettingsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(AppearanceSettingsComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('isDarkMode', false);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should expose isDarkMode input', () => {
    expect(component.isDarkMode()).toBe(false);
  });

  it('should expose themeToggled output', () => {
    const spy = jest.fn();
    component.themeToggled.subscribe(spy);
    component.themeToggled.emit();
    expect(spy).toHaveBeenCalled();
  });
});
