import { GameStateService } from './game-state.service';

describe('GameStateService', () => {
  let service: GameStateService;
  const storageKey = 'svenophone-progress';

  beforeEach(() => {
    localStorage.clear();
    service = new GameStateService();
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
  });
});
