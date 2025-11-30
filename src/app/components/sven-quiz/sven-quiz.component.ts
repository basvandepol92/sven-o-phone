import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { GameConfigService } from '../../services/game-config.service';

interface QuizQuestion {
  id: number;
  question: string;
  answers: string[];
  correctIndex: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Wat is Sven zijn favoriete dier?',
    answers: ['Wasbeer', 'Olifant', 'Dinosaurus', 'Konijn'],
    correctIndex: 0
  },
  {
    id: 2,
    question: 'Naar welke piet keek Sven heel verliefd op de foto op scouting?',
    answers: ['Pietje plezier', 'Hoofd piet', 'Stuiter Piet', 'Pietje paniek'],
    correctIndex: 2
  },
  {
    id: 3,
    question: 'Wat is Sven zijn favoriete voetbalclub?',
    answers: ['Ajax', 'PSV', 'Feyenoord', 'FC Utrecht'],
    correctIndex: 3
  },
  {
    id: 4,
    question: 'Wat wil Sven later worden?',
    answers: ['Brandweerman', 'IT-er', 'Burgemeester', 'Kok'],
    correctIndex: 1
  },
  {
    id: 5,
    question: 'Wat is de tekening meest rechtsbovenin, naast de lichtknop, bij Opa&Oma op de slaapkamer',
    answers: ['Muis', 'Baby', 'Aapje', 'Vis'],
    correctIndex: 3
  },
  {
    id: 6,
    question: 'Welke geluidjes maakt Sven het liefste?',
    answers: ['Scheetjes', 'Huilen', 'Lachen', 'Pruttels'],
    correctIndex: 2
  },
  {
    id: 7,
    question: 'Wie is Sven zijn grote voorbeeld?',
    answers: ['Superman', 'Spiderman', 'Ome Bas', 'Batman'],
    correctIndex: 2
  },
  {
    id: 8,
    question: 'Wat doet Sven het liefste met papa?',
    answers: ['FC Utrecht kijken', 'Luiers verwisselen', 'Verstoppertje', 'Slapen'],
    correctIndex: 0
  },
  {
    id: 9,
    question: 'Hoelaat is Sven geboren?',
    answers: ['04.15u', '04.16u', '04.17u', '04.18u'],
    correctIndex: 3
  },
  {
    id: 10,
    question: 'Hoe zwaar woog Sven bij geboorte?',
    answers: ['4305 gram', '3405 gram', '3404 gram', '4304 gram'],
    correctIndex: 1
  }
];

@Component({
  selector: 'app-sven-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sven-quiz.component.html',
  styleUrls: ['./sven-quiz.component.scss']
})
export class SvenQuizComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly gameState = inject(GameStateService);
  private readonly configService = inject(GameConfigService);
  questions = QUIZ_QUESTIONS;
  currentQuestionIndex = 0;
  lives = 3;
  timeLeft = 0;
  timerId?: number;
  showIntro = true;
  showFailure = false;
  showSuccess = false;
  answeredCorrect = 0;
  canAnswer = false;
  showFeedback = false;
  lastAnswerCorrect = false;
  requiredCorrectAnswers = 0;
  secondsPerQuestion = 0;

  ngOnInit(): void {
    this.applyConfig();
    this.timeLeft = this.secondsPerQuestion;
    // Intro shows by default; game starts after Start button.
  }

  startGame(): void {
    this.applyConfig();
    this.resetGame();
    this.showIntro = false;
    this.startQuestion();
  }

  resetGame(): void {
    this.clearTimer();
    this.currentQuestionIndex = 0;
    this.lives = 3;
    this.timeLeft = this.secondsPerQuestion;
    this.showFailure = false;
    this.showSuccess = false;
    this.answeredCorrect = 0;
    this.canAnswer = false;
    this.showFeedback = false;
    this.lastAnswerCorrect = false;
  }

  startQuestion(): void {
    this.clearTimer();
    this.timeLeft = this.secondsPerQuestion;
    this.canAnswer = true;
    this.showFeedback = false;
    this.timerId = window.setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }

  handleAnswerSelection(index: number): void {
    if (!this.canAnswer || this.showFailure || this.showSuccess) {
      return;
    }
    const question = this.questions[this.currentQuestionIndex];
    this.canAnswer = false;
    this.clearTimer();

    if (index === question.correctIndex) {
      this.answeredCorrect += 1;
      this.lastAnswerCorrect = true;
    } else {
      this.lives -= 1;
      this.lastAnswerCorrect = false;
    }

    this.evaluateRoundEnd();
  }

  handleTimeout(): void {
    this.clearTimer();
    this.canAnswer = false;
    this.lives -= 1;
    this.lastAnswerCorrect = false;
    this.evaluateRoundEnd();
  }

  handleFailure(): void {
    this.clearTimer();
    this.showFailure = true;
  }

  handleWin(): void {
    this.clearTimer();
    this.showSuccess = true;
    this.canAnswer = false;
    // Mark completion of game 3.
    this.gameState.markGameCompleted(3);
  }

  tryAgain(): void {
    this.resetGame();
    this.startQuestion();
  }

  proceedAfterFeedback(): void {
    this.showFeedback = false;
    this.currentQuestionIndex += 1;
    this.startQuestion();
  }

  goBack(): void {
    this.clearTimer();
    this.router.navigateByUrl('/start');
  }

  get progressLabel(): string {
    return `Vraag ${this.currentQuestionIndex + 1}/${this.questions.length}`;
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get feedbackTitle(): string {
    return this.lastAnswerCorrect ? 'Goed gedaan!' : 'Helaas, fout antwoord';
  }

  private evaluateRoundEnd(): void {
    const isLast = this.currentQuestionIndex >= this.questions.length - 1;

    if (this.lives <= 0) {
      this.handleFailure();
      return;
    }

    if (isLast) {
      if (this.answeredCorrect >= this.requiredCorrectAnswers) {
        this.handleWin();
      } else {
        this.handleFailure();
      }
      return;
    }

    // Show feedback overlay before moving on.
    this.showFeedback = true;
  }

  private clearTimer(): void {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private applyConfig(): void {
    const cfg = this.configService.getConfig();
    this.requiredCorrectAnswers = Math.max(1, Math.min(this.questions.length, cfg.quiz.requiredCorrectAnswers));
    this.secondsPerQuestion = Math.max(1, cfg.quiz.secondsPerQuestion);
  }
}
