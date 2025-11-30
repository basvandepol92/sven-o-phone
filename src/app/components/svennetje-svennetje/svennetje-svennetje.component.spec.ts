import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvennetjeSvennetjeComponent } from './svennetje-svennetje.component';
import { GameStateService } from '../../services/game-state.service';
import { GameConfigService } from '../../services/game-config.service';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class GameStateStub {
  markGameCompleted = jasmine.createSpy('markGameCompleted');
}

class GameConfigStub {
  getConfig = jasmine.createSpy('getConfig').and.returnValue({
    svennieKruipt: { minScoreToWin: 10 },
    svennetjeSvennetje: { requiredCorrectCount: 2 },
    quiz: { requiredCorrectAnswers: 10, secondsPerQuestion: 10 }
  });
}

describe('SvennetjeSvennetjeComponent', () => {
  let component: SvennetjeSvennetjeComponent;
  let fixture: ComponentFixture<SvennetjeSvennetjeComponent>;
  let gameState: GameStateStub;

  beforeEach(async () => {
    gameState = new GameStateStub();
    await TestBed.configureTestingModule({
      imports: [SvennetjeSvennetjeComponent],
      providers: [
        { provide: GameStateService, useValue: gameState },
        { provide: GameConfigService, useClass: GameConfigStub },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SvennetjeSvennetjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.requiredTarget).toBe(2);
  });

  it('should increment correct count and win when reaching target', () => {
    component['correctCount'] = 1;
    component.handleSuccess();
    expect(gameState.markGameCompleted).toHaveBeenCalledWith(2);
    expect(component.showSuccess).toBeTrue();
  });
});
