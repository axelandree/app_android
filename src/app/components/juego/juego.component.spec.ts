import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JuegoComponent } from './juego.component';

describe('JuegoComponent', () => {
  let component: JuegoComponent;
  let fixture: ComponentFixture<JuegoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [JuegoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
