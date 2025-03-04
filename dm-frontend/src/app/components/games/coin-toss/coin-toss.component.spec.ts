import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CoinTossComponent } from './coin-toss.component';


describe('CoinTossComponent', () => {
  let component: CoinTossComponent;
  let fixture: ComponentFixture<CoinTossComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CoinTossComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinTossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
