import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhaserTestComponent } from './phaser-test.component';


describe('PhaserTestComponent', () => {
  let component: PhaserTestComponent;
  let fixture: ComponentFixture<PhaserTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PhaserTestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaserTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
