import { GameConfigService } from './game-config.service';

describe('GameConfigService', () => {
  const storageKey = 'svenophoneGameConfig';

  beforeEach(() => {
    localStorage.clear();
  });

  it('should load defaults when no storage', () => {
    const service = new GameConfigService();
    const cfg = service.getConfig();
    expect(cfg.svennieKruipt.minScoreToWin).toBe(10);
  });

  it('should update and persist config', () => {
    const service = new GameConfigService();
    service.updateConfig({ svennieKruipt: { minScoreToWin: 8 } });
    const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
    expect(stored.svennieKruipt.minScoreToWin).toBe(8);
  });

  it('should reset to defaults', () => {
    const service = new GameConfigService();
    service.updateConfig({ quiz: { secondsPerQuestion: 5, requiredCorrectAnswers: 8 } });
    service.resetConfigToDefaults();
    const cfg = service.getConfig();
    expect(cfg.quiz.secondsPerQuestion).toBe(10);
    expect(cfg.quiz.requiredCorrectAnswers).toBe(10);
  });
});
