import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuareqComponent } from './quareq.component';

describe('QuareqComponent', () => {
  let component: QuareqComponent;
  let fixture: ComponentFixture<QuareqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuareqComponent]
    });
    fixture = TestBed.createComponent(QuareqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
