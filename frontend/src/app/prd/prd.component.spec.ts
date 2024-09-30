import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdComponent } from './prd.component';

describe('PrdComponent', () => {
  let component: PrdComponent;
  let fixture: ComponentFixture<PrdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrdComponent]
    });
    fixture = TestBed.createComponent(PrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
