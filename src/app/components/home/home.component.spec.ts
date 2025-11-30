import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { Router } from '@angular/router';
import { SoundtrackService } from '../../services/soundtrack.service';
import { provideRouter } from '@angular/router';

class RouterStub {
  navigateByUrl = jasmine.createSpy('navigateByUrl');
}

class SoundtrackStub {
  initialize = jasmine.createSpy('initialize');
  play = jasmine.createSpy('play');
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: RouterStub;
  let soundtrack: SoundtrackStub;

  beforeEach(async () => {
    router = new RouterStub();
    soundtrack = new SoundtrackStub();

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: SoundtrackService, useValue: soundtrack },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close instructions popup', () => {
    expect(component.instructionsOpen).toBeFalse();
    component.openInstructions();
    expect(component.instructionsOpen).toBeTrue();
    component.closeInstructions();
    expect(component.instructionsOpen).toBeFalse();
  });

  it('should start soundtrack and navigate on startGame', () => {
    component.startGame();
    expect(soundtrack.initialize).toHaveBeenCalled();
    expect(soundtrack.play).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/start');
  });
});
