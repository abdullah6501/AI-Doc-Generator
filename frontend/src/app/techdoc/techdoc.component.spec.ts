import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechdocComponent } from './techdoc.component';

describe('TechdocComponent', () => {
  let component: TechdocComponent;
  let fixture: ComponentFixture<TechdocComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechdocComponent]
    });
    fixture = TestBed.createComponent(TechdocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
