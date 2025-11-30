import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SvenQuizComponent } from './sven-quiz.component';
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
    svennetjeSvennetje: { requiredCorrectCount: 5 },
    quiz: { requiredCorrectAnswers: 2, secondsPerQuestion: 2 }
  });
}

describe('SvenQuizComponent', () => {
  let component: SvenQuizComponent;
  let fixture: ComponentFixture<SvenQuizComponent>;
  let gameState: GameStateStub;

  beforeEach(async () => {
    gameState = new GameStateStub();
    await TestBed.configureTestingModule({
      imports: [SvenQuizComponent],
      providers: [
        { provide: GameStateService, useValue: gameState },
        { provide: GameConfigService, useClass: GameConfigStub },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SvenQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.secondsPerQuestion).toBe(2);
  });

  it('should reduce lives on timeout', fakeAsync(() => {
    component.startGame();
    tick(2100);
    expect(component.lives).toBe(2);
  }));

  it('should mark completion when enough correct answers', () => {
    component.startGame();
    component['answeredCorrect'] = 2;
    component['currentQuestionIndex'] = component.questions.length - 1;
    component['evaluateRoundEnd']();
    expect(gameState.markGameCompleted).toHaveBeenCalledWith(3);
    expect(component.showSuccess).toBeTrue();
  });

  it('should show failure when lives reach zero', fakeAsync(() => {
    component.startGame();
    component.lives = 1;
    component.handleTimeout();
    expect(component.showFailure).toBeTrue();
  }));
});
