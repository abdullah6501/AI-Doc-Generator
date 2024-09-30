import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrdComponent } from './frd.component';

describe('FrdComponent', () => {
  let component: FrdComponent;
  let fixture: ComponentFixture<FrdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrdComponent]
    });
    fixture = TestBed.createComponent(FrdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
