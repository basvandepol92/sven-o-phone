import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InstructionsDialogComponent } from './instructions-dialog.component';

describe('InstructionsDialogComponent', () => {
  let component: InstructionsDialogComponent;
  let fixture: ComponentFixture<InstructionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionsDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InstructionsDialogComponent);
    component = fixture.componentInstance;
    component.open = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close when clicking button', () => {
    spyOn(component.closed, 'emit');
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.closed.emit).toHaveBeenCalled();
  });
});
