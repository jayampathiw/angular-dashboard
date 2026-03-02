import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { UserDialogComponent, UserDialogData } from './user-dialog.component';
import { Role } from '../../../../core/models/auth.model';
import { UserItem } from '../../models/users.model';

describe('UserDialogComponent', () => {
  let dialogRefSpy: { close: jest.Mock };

  function createComponent(data: UserDialogData): UserDialogComponent {
    dialogRefSpy = { close: jest.fn() };

    TestBed.configureTestingModule({
      imports: [UserDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    TestBed.overrideComponent(UserDialogComponent, {
      set: { imports: [], schemas: [NO_ERRORS_SCHEMA] },
    });

    const fixture = TestBed.createComponent(UserDialogComponent);
    return fixture.componentInstance;
  }

  describe('create mode', () => {
    let component: UserDialogComponent;

    beforeEach(() => {
      component = createComponent({ mode: 'create' });
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should set isEdit to false', () => {
      expect(component.isEdit).toBe(false);
    });

    it('should initialize form with empty values', () => {
      expect(component.form.get('firstName')?.value).toBe('');
      expect(component.form.get('lastName')?.value).toBe('');
      expect(component.form.get('email')?.value).toBe('');
      expect(component.form.get('department')?.value).toBe('');
    });

    it('should default role to Viewer', () => {
      expect(component.form.get('role')?.value).toBe(Role.Viewer);
    });

    it('should default status to active', () => {
      expect(component.form.get('status')?.value).toBe('active');
    });

    it('should have an invalid form initially', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should expose roles list', () => {
      expect(component.roles).toHaveLength(3);
      expect(component.roles.map((r) => r.value)).toEqual([
        Role.Admin,
        Role.Editor,
        Role.Viewer,
      ]);
    });

    it('should expose statuses list', () => {
      expect(component.statuses).toHaveLength(3);
      expect(component.statuses.map((s) => s.value)).toEqual([
        'active',
        'inactive',
        'suspended',
      ]);
    });

    it('should expose departments list', () => {
      expect(component.departments).toContain('Engineering');
      expect(component.departments).toHaveLength(7);
    });
  });

  describe('edit mode', () => {
    let component: UserDialogComponent;
    const mockUser: UserItem = {
      id: 'usr-001',
      email: 'alice@demo.com',
      firstName: 'Alice',
      lastName: 'Smith',
      avatar: '',
      role: Role.Editor,
      status: 'active',
      department: 'Engineering',
      createdAt: '2024-01-01',
      lastLogin: '2024-06-01',
    };

    beforeEach(() => {
      component = createComponent({ mode: 'edit', user: mockUser });
    });

    it('should set isEdit to true', () => {
      expect(component.isEdit).toBe(true);
    });

    it('should populate form with user data', () => {
      expect(component.form.get('firstName')?.value).toBe('Alice');
      expect(component.form.get('lastName')?.value).toBe('Smith');
      expect(component.form.get('email')?.value).toBe('alice@demo.com');
      expect(component.form.get('role')?.value).toBe(Role.Editor);
      expect(component.form.get('department')?.value).toBe('Engineering');
      expect(component.form.get('status')?.value).toBe('active');
    });

    it('should have a valid form with user data', () => {
      expect(component.form.valid).toBe(true);
    });
  });

  describe('form validation', () => {
    let component: UserDialogComponent;

    beforeEach(() => {
      component = createComponent({ mode: 'create' });
    });

    it('should require firstName', () => {
      expect(component.form.get('firstName')?.hasError('required')).toBe(true);
    });

    it('should require lastName', () => {
      expect(component.form.get('lastName')?.hasError('required')).toBe(true);
    });

    it('should require email', () => {
      expect(component.form.get('email')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      component.form.patchValue({ email: 'invalid' });
      expect(component.form.get('email')?.hasError('email')).toBe(true);
    });

    it('should require department', () => {
      expect(component.form.get('department')?.hasError('required')).toBe(
        true,
      );
    });

    it('should be valid with all fields filled', () => {
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        role: Role.Admin,
        department: 'Engineering',
        status: 'active',
      });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    let component: UserDialogComponent;

    beforeEach(() => {
      component = createComponent({ mode: 'create' });
    });

    it('should close dialog with form value when valid', () => {
      component.form.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        role: Role.Admin,
        department: 'Engineering',
        status: 'active',
      });

      component.onSubmit();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        role: Role.Admin,
        department: 'Engineering',
        status: 'active',
      });
    });

    it('should not close dialog when form is invalid', () => {
      component.onSubmit();
      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched on invalid submit', () => {
      component.onSubmit();
      expect(component.form.get('firstName')?.touched).toBe(true);
      expect(component.form.get('email')?.touched).toBe(true);
      expect(component.form.get('department')?.touched).toBe(true);
    });
  });

  describe('onCancel', () => {
    it('should close dialog without result', () => {
      const component = createComponent({ mode: 'create' });
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalledWith();
    });
  });
});
