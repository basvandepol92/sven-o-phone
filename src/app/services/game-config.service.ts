import { Injectable } from '@angular/core';

export interface SvenGameConfig {
  svennieKruipt: {
    minScoreToWin: number;
  };
  svennetjeSvennetje: {
    requiredCorrectCount: number;
  };
  quiz: {
    requiredCorrectAnswers: number;
    secondsPerQuestion: number;
  };
}

const DEFAULT_CONFIG: SvenGameConfig = {
  svennieKruipt: {
    minScoreToWin: 10
  },
  svennetjeSvennetje: {
    requiredCorrectCount: 5
  },
  quiz: {
    requiredCorrectAnswers: 10,
    secondsPerQuestion: 10
  }
};

const CONFIG_STORAGE_KEY = 'svenophoneGameConfig';

@Injectable({ providedIn: 'root' })
export class GameConfigService {
  private config: SvenGameConfig = { ...DEFAULT_CONFIG };

  constructor() {
    this.loadConfig();
  }

  getConfig(): SvenGameConfig {
    return structuredClone(this.config);
  }

  updateConfig(partial: Partial<SvenGameConfig>): void {
    this.config = {
      ...this.config,
      ...partial,
      svennieKruipt: {
        ...this.config.svennieKruipt,
        ...(partial.svennieKruipt ?? {})
      },
      svennetjeSvennetje: {
        ...this.config.svennetjeSvennetje,
        ...(partial.svennetjeSvennetje ?? {})
      },
      quiz: {
        ...this.config.quiz,
        ...(partial.quiz ?? {})
      }
    };
    this.saveConfig();
  }

  resetConfigToDefaults(): SvenGameConfig {
    this.config = { ...DEFAULT_CONFIG };
    this.saveConfig();
    return this.getConfig();
  }

  private loadConfig(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as SvenGameConfig;
      this.config = {
        ...DEFAULT_CONFIG,
        ...parsed,
        svennieKruipt: { ...DEFAULT_CONFIG.svennieKruipt, ...(parsed.svennieKruipt ?? {}) },
        svennetjeSvennetje: {
          ...DEFAULT_CONFIG.svennetjeSvennetje,
          ...(parsed.svennetjeSvennetje ?? {})
        },
        quiz: { ...DEFAULT_CONFIG.quiz, ...(parsed.quiz ?? {}) }
      };
    } catch {
      this.config = { ...DEFAULT_CONFIG };
    }
  }

  private saveConfig(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // Ignore persistence errors
    }
  }
}
