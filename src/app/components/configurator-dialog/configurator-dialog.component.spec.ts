import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguratorDialogComponent } from './configurator-dialog.component';
import { FormsModule } from '@angular/forms';
import { SvenGameConfig } from '../../services/game-config.service';

const DEFAULT_CONFIG: SvenGameConfig = {
  svennieKruipt: { minScoreToWin: 10 },
  svennetjeSvennetje: { requiredCorrectCount: 5 },
  quiz: { requiredCorrectAnswers: 10, secondsPerQuestion: 10 }
};

describe('ConfiguratorDialogComponent', () => {
  let component: ConfiguratorDialogComponent;
  let fixture: ComponentFixture<ConfiguratorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguratorDialogComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguratorDialogComponent);
    component = fixture.componentInstance;
    component.config = DEFAULT_CONFIG;
    component.completedIds = [1];
    component.ngOnChanges();
    fixture.detectChanges();
  });

  it('should create with defaults', () => {
    expect(component).toBeTruthy();
    expect(component.workingCopy.svennieKruipt.minScoreToWin).toBe(10);
  });

  it('should emit save with updated values', () => {
    spyOn(component.save, 'emit');
    component.workingCopy.svennieKruipt.minScoreToWin = 7;
    component.onSave();
    expect(component.save.emit).toHaveBeenCalled();
    const payload = (component.save.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(payload.config.svennieKruipt.minScoreToWin).toBe(7);
  });

  it('should emit cancel', () => {
    spyOn(component.cancelled, 'emit');
    component.onCancel();
    expect(component.cancelled.emit).toHaveBeenCalled();
  });

  it('should emit resetAll', () => {
    spyOn(component.resetAll, 'emit');
    component.onResetAll();
    expect(component.resetAll.emit).toHaveBeenCalled();
  });
});
