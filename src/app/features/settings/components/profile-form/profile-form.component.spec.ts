import { ComponentRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileFormComponent, ProfileData } from './profile-form.component';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let componentRef: ComponentRef<ProfileFormComponent>;

  const mockProfile: ProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-1234',
    company: 'Acme',
    department: 'Engineering',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfileFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('profile', mockProfile);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with correct controls', () => {
    expect(component.form.get('firstName')).toBeTruthy();
    expect(component.form.get('lastName')).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('phone')).toBeTruthy();
    expect(component.form.get('company')).toBeTruthy();
    expect(component.form.get('department')).toBeTruthy();
  });

  it('should patch form with profile data on init', () => {
    component.ngOnInit();

    expect(component.form.get('firstName')?.value).toBe('John');
    expect(component.form.get('email')?.value).toBe('john@example.com');
  });

  it('should require firstName', () => {
    component.form.patchValue({ firstName: '' });
    expect(component.form.get('firstName')?.hasError('required')).toBe(true);
  });

  it('should require lastName', () => {
    component.form.patchValue({ lastName: '' });
    expect(component.form.get('lastName')?.hasError('required')).toBe(true);
  });

  it('should require valid email', () => {
    component.form.patchValue({ email: 'invalid' });
    expect(component.form.get('email')?.hasError('email')).toBe(true);
  });

  it('should emit on valid submit', () => {
    const spy = jest.fn();
    component.profileSaved.subscribe(spy);

    component.ngOnInit();
    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'John',
      email: 'john@example.com',
    }));
  });

  it('should not emit on invalid submit', () => {
    const spy = jest.fn();
    component.profileSaved.subscribe(spy);

    component.form.patchValue({ firstName: '', lastName: '', email: '' });
    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should mark all as touched on invalid submit', () => {
    component.form.patchValue({ firstName: '', lastName: '', email: '' });
    component.onSubmit();

    expect(component.form.get('firstName')?.touched).toBe(true);
    expect(component.form.get('lastName')?.touched).toBe(true);
    expect(component.form.get('email')?.touched).toBe(true);
  });
});
