import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StartScreenComponent } from './start-screen.component';
import { GameStateService } from '../../services/game-state.service';
import { GameConfigService } from '../../services/game-config.service';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PwaService } from '../../services/pwa.service';

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
  shouldShowSplashAfterGame3 = jasmine.createSpy('shouldShowSplashAfterGame3').and.returnValue(false);
  hasShownSplashAfterGame3 = jasmine.createSpy('hasShownSplashAfterGame3').and.returnValue(false);
  markSplashShown = jasmine.createSpy('markSplashShown');
  resetProgress = jasmine.createSpy('resetProgress');
}

class GameConfigStub {
  private readonly cfg = {
    svennieKruipt: { minScoreToWin: 10 },
    svennetjeSvennetje: { requiredCorrectCount: 5 },
    quiz: { requiredCorrectAnswers: 10, secondsPerQuestion: 10 }
  };
  getConfig = jasmine.createSpy('getConfig').and.callFake(() => this.cfg);
  resetConfigToDefaults = jasmine
    .createSpy('resetConfigToDefaults')
    .and.callFake(() => this.cfg);
}

class PwaServiceStub {
  isStandalone = jasmine.createSpy('isStandalone').and.returnValue(true);
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
        { provide: PwaService, useClass: PwaServiceStub },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(StartScreenComponent);
    component = fixture.componentInstance;
  });

  it('should create and render three game cards', () => {
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.game-card');
    expect(cards.length).toBe(3);
  });

  it('should lock games 2 and 3 by default', () => {
    fixture.detectChanges();
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
    fixture.detectChanges();
    const sleepEl: HTMLElement = fixture.nativeElement.querySelector('.sleep');
    sleepEl.click();
    tick(100);
    sleepEl.click();
    tick(100);
    sleepEl.click();
    fixture.detectChanges();
    expect(component.showConfigurator).toBeTrue();
  }));

  it('should show splash when pending and mark it as shown', () => {
    gameState.shouldShowSplashAfterGame3.and.returnValue(true);
    gameState.hasShownSplashAfterGame3.and.returnValue(false);
    fixture.detectChanges();
    expect(component.showSplash).toBeTrue();
    expect(gameState.markSplashShown).toHaveBeenCalledTimes(1);
    const overlay = fixture.nativeElement.querySelector('.splash-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should not show splash when already shown', () => {
    gameState.shouldShowSplashAfterGame3.and.returnValue(true);
    gameState.hasShownSplashAfterGame3.and.returnValue(true);
    fixture.detectChanges();
    expect(component.showSplash).toBeFalse();
    expect(gameState.markSplashShown).not.toHaveBeenCalled();
    const overlay = fixture.nativeElement.querySelector('.splash-overlay');
    expect(overlay).toBeFalsy();
  });

  it('should close splash when close button clicked', () => {
    gameState.shouldShowSplashAfterGame3.and.returnValue(true);
    gameState.hasShownSplashAfterGame3.and.returnValue(false);
    fixture.detectChanges();
    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector('.splash-overlay__close');
    expect(closeButton).toBeTruthy();
    closeButton.click();
    fixture.detectChanges();
    expect(component.showSplash).toBeFalse();
    const overlay = fixture.nativeElement.querySelector('.splash-overlay');
    expect(overlay).toBeFalsy();
  });

  it('should render confetti pieces while splash is visible', () => {
    gameState.shouldShowSplashAfterGame3.and.returnValue(true);
    gameState.hasShownSplashAfterGame3.and.returnValue(false);
    fixture.detectChanges();

    const pieces: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.confetti-piece'));
    expect(pieces.length).toBeGreaterThan(0);
  });

  it('should reset game and splash state via configurator', () => {
    fixture.detectChanges();
    component.resetGameAndConfig();
    expect(gameState.resetProgress).toHaveBeenCalled();
  });

  it('should still render game grid without PWA hint', () => {
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.start__header');
    expect(header.textContent).toContain('Kies, speel en verdien');
  });
});
