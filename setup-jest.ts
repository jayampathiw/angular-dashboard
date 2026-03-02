import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
import { TestBed } from '@angular/core/testing';

// Guard against double initialization (ng test via @angular-builders/jest already initializes)
if (!(TestBed as any)['_environmentTeardownOptions']) {
  try {
    setupZoneTestEnv({
      errorOnUnknownElements: true,
      errorOnUnknownProperties: true,
    });
  } catch {
    // Already initialized by @angular-builders/jest
  }
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
