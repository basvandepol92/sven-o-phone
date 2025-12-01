import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;
  const storageKey = 'svenophone-progress';

  beforeEach(() => {
    localStorage.clear();
    service = new GameStateService();
  });

  it('should default splash flags to false', () => {
    expect(service.shouldShowSplashAfterGame3()).toBeFalse();
    expect(service.hasShownSplashAfterGame3()).toBeFalse();
  });

  it('should unlock only game 1 by default', () => {
    expect(service.isGameUnlocked(1)).toBeTrue();
    expect(service.isGameUnlocked(2)).toBeFalse();
    expect(service.isGameUnlocked(3)).toBeFalse();
  });

  it('should mark game completion and unlock next game', () => {
    service.markGameCompleted(1);
    expect(service.isGameCompleted(1)).toBeTrue();
    expect(service.isGameUnlocked(2)).toBeTrue();
    service.markGameCompleted(2);
    expect(service.isGameUnlocked(3)).toBeTrue();
  });

  it('should reset progress', () => {
    service.markGameCompleted(1);
    service.markGameCompleted(2);
    service.resetProgress();
    expect(service.isGameCompleted(1)).toBeFalse();
    expect(service.isGameUnlocked(2)).toBeFalse();
    expect(localStorage.getItem(storageKey)).toContain('[]');
    expect(service.shouldShowSplashAfterGame3()).toBeFalse();
    expect(service.hasShownSplashAfterGame3()).toBeFalse();
  });

  it('should set splash flag after game 3 success and persist it', () => {
    service.setShouldShowSplashAfterGame3(true);
    expect(service.shouldShowSplashAfterGame3()).toBeTrue();
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    expect(stored.shouldShowSplashAfterGame3).toBeTrue();
  });

  it('should mark splash as shown and clear pending flag', () => {
    service.setShouldShowSplashAfterGame3(true);
    service.markSplashShown();
    expect(service.hasShownSplashAfterGame3()).toBeTrue();
    expect(service.shouldShowSplashAfterGame3()).toBeFalse();
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
    expect(stored.hasShownSplashAfterGame3).toBeTrue();
    expect(stored.shouldShowSplashAfterGame3).toBeFalse();
  });

  it('should hydrate splash flags from storage', () => {
    service.setShouldShowSplashAfterGame3(true);
    const restored = new GameStateService();
    expect(restored.shouldShowSplashAfterGame3()).toBeTrue();
    expect(restored.hasShownSplashAfterGame3()).toBeFalse();
  });
});
