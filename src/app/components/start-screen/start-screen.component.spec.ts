import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StartScreenComponent } from './start-screen.component';
import { GameStateService } from '../../services/game-state.service';
import { GameConfigService } from '../../services/game-config.service';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class GameStateStub {
  miniGames = [
    { id: 1, title: 'Spel 1', route: '/game/1' },
    { id: 2, title: 'Spel 2', route: '/game/2' },
    { id: 3, title: 'Spel 3', route: '/game/3' }
  ];
  unlocked = new Set<number>([1]);
  isGameUnlocked = jasmine.createSpy('isGameUnlocked').and.callFake((id: number) => this.unlocked.has(id));
  isGameCompleted = jasmine.createSpy('isGameCompleted').and.callFake((id: number) => this.unlocked.has(id) && id !== 1);
  getCompletedIds = jasmine.createSpy('getCompletedIds').and.returnValue([]);
  setCompletedList = jasmine.createSpy('setCompletedList');
}

class GameConfigStub {
  getConfig = jasmine.createSpy('getConfig').and.returnValue({
    svennieKruipt: { minScoreToWin: 10 },
    svennetjeSvennetje: { requiredCorrectCount: 5 },
    quiz: { requiredCorrectAnswers: 10, secondsPerQuestion: 10 }
  });
  resetConfigToDefaults = jasmine.createSpy('resetConfigToDefaults').and.callFake(() =>
    GameConfigStub.prototype.getConfig()
  );
}

describe('StartScreenComponent', () => {
  let component: StartScreenComponent;
  let fixture: ComponentFixture<StartScreenComponent>;
  let gameState: GameStateStub;

  beforeEach(async () => {
    gameState = new GameStateStub();
    await TestBed.configureTestingModule({
      imports: [StartScreenComponent],
      providers: [
        { provide: GameStateService, useValue: gameState },
        { provide: GameConfigService, useClass: GameConfigStub },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StartScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render three game cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.game-card');
    expect(cards.length).toBe(3);
  });

  it('should lock games 2 and 3 by default', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.game-button'));
    expect(buttons[0].disabled).toBeFalse();
    expect(buttons[1].disabled).toBeTrue();
    expect(buttons[2].disabled).toBeTrue();
  });

  it('should render unlocked when game marked completed', () => {
    gameState.unlocked.add(2);
    fixture.detectChanges();
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.game-button'));
    expect(buttons[1].disabled).toBeFalse();
  });

  it('should open configurator after triple click on sleep status within threshold', fakeAsync(() => {
    const sleepEl: HTMLElement = fixture.nativeElement.querySelector('.sleep');
    sleepEl.click();
    tick(100);
    sleepEl.click();
    tick(100);
    sleepEl.click();
    fixture.detectChanges();
    expect(component.showConfigurator).toBeTrue();
  }));
});
