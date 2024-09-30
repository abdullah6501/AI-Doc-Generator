import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketreqComponent } from './marketreq.component';

describe('MarketreqComponent', () => {
  let component: MarketreqComponent;
  let fixture: ComponentFixture<MarketreqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarketreqComponent]
    });
    fixture = TestBed.createComponent(MarketreqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
