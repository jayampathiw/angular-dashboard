import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let authServiceSpy: { getAccessToken: jest.Mock };

  beforeEach(() => {
    authServiceSpy = { getAccessToken: jest.fn() };

    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
  });

  it('should add Authorization header when token exists', (done) => {
    authServiceSpy.getAccessToken.mockReturnValue('mock-token-123');

    const req = new HttpRequest('GET', '/api/data');
    const next: HttpHandlerFn = (handledReq) => {
      expect(handledReq.headers.get('Authorization')).toBe(
        'Bearer mock-token-123',
      );
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => done());
    });
  });

  it('should not add Authorization header when no token', (done) => {
    authServiceSpy.getAccessToken.mockReturnValue(null);

    const req = new HttpRequest('GET', '/api/data');
    const next: HttpHandlerFn = (handledReq) => {
      expect(handledReq.headers.has('Authorization')).toBe(false);
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => done());
    });
  });

  it('should pass the request to next handler', (done) => {
    authServiceSpy.getAccessToken.mockReturnValue(null);

    const req = new HttpRequest('POST', '/api/users', { name: 'test' });
    const next: HttpHandlerFn = (handledReq) => {
      expect(handledReq.method).toBe('POST');
      expect(handledReq.url).toBe('/api/users');
      return of(new HttpResponse({ status: 201 }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(req, next).subscribe(() => done());
    });
  });
});
