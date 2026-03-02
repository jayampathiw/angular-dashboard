import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let doc: Document;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    doc = TestBed.inject(DOCUMENT);
  });

  afterEach(() => {
    doc.body.classList.remove('dark-theme');
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light mode when no preference is saved', () => {
    expect(service.isDarkMode()).toBe(false);
  });

  it('should toggle to dark mode', () => {
    service.toggleTheme();

    expect(service.isDarkMode()).toBe(true);
    expect(doc.body.classList.contains('dark-theme')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should toggle back to light mode', () => {
    service.toggleTheme();
    service.toggleTheme();

    expect(service.isDarkMode()).toBe(false);
    expect(doc.body.classList.contains('dark-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('should persist theme to localStorage', () => {
    service.toggleTheme();
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggleTheme();
    expect(localStorage.getItem('theme')).toBe('light');
  });

  describe('with saved dark preference', () => {
    beforeEach(() => {
      localStorage.setItem('theme', 'dark');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      service = TestBed.inject(ThemeService);
      doc = TestBed.inject(DOCUMENT);
    });

    it('should restore dark mode from localStorage', () => {
      expect(service.isDarkMode()).toBe(true);
      expect(doc.body.classList.contains('dark-theme')).toBe(true);
    });
  });
});
