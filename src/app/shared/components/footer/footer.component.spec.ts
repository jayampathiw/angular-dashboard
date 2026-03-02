import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    const fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
