import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvennieKruiptComponent } from './svennie-kruipt.component';
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
    quiz: { requiredCorrectAnswers: 10, secondsPerQuestion: 10 }
  });
}

describe('SvennieKruiptComponent', () => {
  let component: SvennieKruiptComponent;
  let fixture: ComponentFixture<SvennieKruiptComponent>;
  let gameState: GameStateStub;
  interface ComponentPrivates {
    refreshTargetScore: () => void;
    handleGameOver: () => void;
    targetScore: number;
    currentScore: number;
  }
  let componentPrivates: ComponentPrivates;

  beforeEach(async () => {
    gameState = new GameStateStub();
    await TestBed.configureTestingModule({
      imports: [SvennieKruiptComponent],
      providers: [
        { provide: GameStateService, useValue: gameState },
        { provide: GameConfigService, useClass: GameConfigStub },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SvennieKruiptComponent);
    component = fixture.componentInstance;
    componentPrivates = component as unknown as ComponentPrivates;
    // Avoid expression changed errors from lifecycle setup in tests
    spyOn(component, 'ngAfterViewInit').and.callFake(() => undefined);
    fixture.detectChanges();
    // run change detection again to settle bindings
    fixture.detectChanges();
  });

  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set targetScore from config on startFromIntro', () => {
    (component as any).targetScore = 0;
    (component as any).refreshTargetScore();
    expect((component as any).targetScore).toBe(10);
  });

  it('should mark game completed when score high enough', () => {
    (component as any).refreshTargetScore();
    (component as any).targetScore = 1;
    component['currentScore'] = 2;
    (component as any).handleGameOver();
    expect(gameState.markGameCompleted).toHaveBeenCalledWith(1);
  }); */

  it('should not mark game completed when score below target', () => {
    componentPrivates.refreshTargetScore();
    componentPrivates.targetScore = 5;
    componentPrivates.currentScore = 1;
    componentPrivates.handleGameOver();
    expect(gameState.markGameCompleted).not.toHaveBeenCalled();
  });
});
