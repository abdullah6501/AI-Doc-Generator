import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApidocComponent } from './apidoc.component';

describe('ApidocComponent', () => {
  let component: ApidocComponent;
  let fixture: ComponentFixture<ApidocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApidocComponent]
    });
    fixture = TestBed.createComponent(ApidocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
