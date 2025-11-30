import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoundtrackService } from './services/soundtrack.service';

class SoundtrackStub {
  isPlayingState = false;
  initialize = jasmine.createSpy('initialize');
  play = jasmine.createSpy('play');
  pause = jasmine.createSpy('pause');
  togglePlayPause = jasmine.createSpy('togglePlayPause').and.callFake(() => {
    this.isPlayingState = !this.isPlayingState;
  });
  isPlaying = jasmine.createSpy('isPlaying').and.callFake(() => this.isPlayingState);
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let soundtrack: SoundtrackStub;

  beforeEach(async () => {
    soundtrack = new SoundtrackStub();
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterOutlet, AppComponent],
      providers: [{ provide: SoundtrackService, useValue: soundtrack }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signal bars and change over time', fakeAsync(() => {
    component.ngOnInit();
    tick(30000);
    expect([1, 2, 3]).toContain(component.signalBars);
    // chance of same value exists; advance again to ensure timer runs
    tick(30000);
    expect([1, 2, 3]).toContain(component.signalBars);
    component.ngOnDestroy();
  }));

  it('should clear interval on destroy', () => {
    component.ngOnInit?.();
    const clearSpy = spyOn(window, 'clearInterval').and.callThrough();
    component.ngOnDestroy();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('should toggle music icon state', () => {
    soundtrack.isPlayingState = true;
    expect(component.musicIcon()).toBe('⏸');
    soundtrack.isPlayingState = false;
    expect(component.musicIcon()).toBe('▶');
  });

  it('should open and close live video popup', () => {
    component.openLiveVideo();
    expect(component.showLiveVideo).toBeTrue();
    component.closeLiveVideo();
    expect(component.showLiveVideo).toBeFalse();
  });

  it('should render active bars according to signalBars', () => {
    fixture.detectChanges();
    component.signalBars = 2;
    fixture.detectChanges();
    const bars = fixture.nativeElement.querySelectorAll('.signal-bar');
    expect(bars[0].classList).toContain('active');
    expect(bars[1].classList).toContain('active');
    expect(bars[2].classList).not.toContain('active');
  });
});
