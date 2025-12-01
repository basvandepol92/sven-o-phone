import { PwaService } from './pwa.service';

describe('PwaService', () => {
  let originalNavigator: Navigator;
  let originalMatchMedia: typeof window.matchMedia;
  let service: PwaService;

  beforeEach(() => {
    service = new PwaService();
    originalNavigator = window.navigator;
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      configurable: true
    });
    window.matchMedia = originalMatchMedia;
  });

  it('should detect iOS standalone via navigator.standalone', () => {
    const mockNavigator = { ...originalNavigator, standalone: true };
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      configurable: true
    });

    expect(service.isStandalone()).toBeTrue();
  });

  it('should detect standalone via matchMedia', () => {
    const mockNavigator = { ...originalNavigator, standalone: undefined };
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      configurable: true
    });
    window.matchMedia = () =>
      ({
        matches: true
      } as MediaQueryList);

    expect(service.isStandalone()).toBeTrue();
  });

  it('should return false when no standalone indicators present', () => {
    const mockNavigator = { ...originalNavigator, standalone: undefined };
    Object.defineProperty(window, 'navigator', {
      value: mockNavigator,
      configurable: true
    });
    window.matchMedia = () =>
      ({
        matches: false
      } as MediaQueryList);

    expect(service.isStandalone()).toBeFalse();
  });
});
