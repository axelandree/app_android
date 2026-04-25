import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameoverComponent } from './gameover.component';

describe('GameoverComponent', () => {
  let component: GameoverComponent;
  let fixture: ComponentFixture<GameoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [GameoverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
