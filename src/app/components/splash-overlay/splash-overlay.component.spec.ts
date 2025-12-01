import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplashOverlayComponent } from './splash-overlay.component';

describe('SplashOverlayComponent', () => {
  let fixture: ComponentFixture<SplashOverlayComponent>;
  let component: SplashOverlayComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SplashOverlayComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SplashOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render confetti pieces', () => {
    const pieces = fixture.nativeElement.querySelectorAll('.confetti-piece');
    expect(pieces.length).toBe(component.confettiPieces.length);
    expect(pieces.length).toBeGreaterThan(0);
  });

  it('should emit close event', () => {
    spyOn(component.closed, 'emit');
    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.splash-overlay__close');
    closeBtn.click();
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should emit close when backdrop is clicked', () => {
    spyOn(component.closed, 'emit');
    const backdrop: HTMLElement = fixture.nativeElement.querySelector('.splash-overlay__backdrop');
    backdrop.click();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
