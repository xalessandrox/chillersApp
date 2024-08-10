import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDialogComponent } from './game-dialog.component';

describe('GameModalComponent', () => {
  let component: GameDialogComponent;
  let fixture: ComponentFixture<GameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [GameDialogComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(GameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
