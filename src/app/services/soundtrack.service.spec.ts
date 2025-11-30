import { SoundtrackService } from './soundtrack.service';

describe('SoundtrackService', () => {
  let service: SoundtrackService;
  let playSpy: jasmine.Spy;
  let pauseSpy: jasmine.Spy;
  interface AudioMock {
    play: jasmine.Spy<() => Promise<void>>;
    pause: jasmine.Spy<() => void>;
    load: jasmine.Spy<() => void>;
    loop: boolean;
    volume: number;
    src: string;
  }
  let audioMock: AudioMock;

  beforeEach(() => {
    audioMock = {
      play: jasmine.createSpy('play').and.returnValue(Promise.resolve()),
      pause: jasmine.createSpy('pause'),
      load: jasmine.createSpy('load'),
      loop: false,
      volume: 1,
      src: ''
    };
    playSpy = audioMock.play;
    pauseSpy = audioMock.pause;
    Object.defineProperty(window, 'Audio', { writable: true, value: function (path?: string) {
      audioMock.src = path || '';
      return audioMock as unknown as HTMLAudioElement;
    } });
    service = new SoundtrackService();
  });

  it('should initialize audio with loop and volume', () => {
    service.initialize('path.mp3');
    expect(audioMock.loop).toBeTrue();
    expect(audioMock.src).toContain('path.mp3');
  });

  it('should play and pause', async () => {
    service.initialize('path.mp3');
    await service.play();
    expect(playSpy).toHaveBeenCalled();
    service.pause();
    expect(pauseSpy).toHaveBeenCalled();
  });

  it('togglePlayPause should switch state', async () => {
    service.initialize('path.mp3');
    await service.play();
    service.togglePlayPause();
    expect(pauseSpy).toHaveBeenCalled();
  });
});
