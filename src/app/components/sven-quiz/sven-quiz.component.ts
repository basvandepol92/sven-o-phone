import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';

interface QuizQuestion {
  id: number;
  question: string;
  answers: string[];
  correctIndex: number;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Wat is Sven zijn favoriete knuffel?',
    answers: ['Beer', 'Olifant', 'Dinosaurus', 'Konijn'],
    correctIndex: 0
  },
  {
    id: 2,
    question: 'Welke kleur pyjama draagt Sven het liefst?',
    answers: ['Blauw', 'Geel', 'Groen', 'Roze'],
    correctIndex: 0
  },
  {
    id: 3,
    question: 'Wat is Sven zijn favoriete liedje om op te slapen?',
    answers: ['Twinkle Twinkle', 'Slaap kindje slaap', 'Vlinder', 'Baby shark'],
    correctIndex: 1
  },
  {
    id: 4,
    question: 'Welk drankje vindt Sven het lekkerst?',
    answers: ['Melk', 'Water', 'Sap', 'Chocomelk'],
    correctIndex: 0
  },
  {
    id: 5,
    question: 'Hoe zegt Sven hallo?',
    answers: ['Handje', 'Knuffel', 'High five', 'Kus'],
    correctIndex: 2
  },
  {
    id: 6,
    question: 'Wat is Sven zijn favoriete dierengeluid?',
    answers: ['Boe', 'Miauw', 'Oink', 'Woef'],
    correctIndex: 3
  },
  {
    id: 7,
    question: 'Waar slaapt Sven het liefst?',
    answers: ['Wiegbak', 'Ouders bed', 'Bank', 'Autostoel'],
    correctIndex: 0
  },
  {
    id: 8,
    question: 'Hoeveel tandjes heeft Sven?',
    answers: ['0', '2', '4', '6'],
    correctIndex: 2
  },
  {
    id: 9,
    question: 'Wat is Sven zijn favoriete tijd van de dag?',
    answers: ['Ochtend', 'Middag', 'Avond', 'Nacht'],
    correctIndex: 0
  },
  {
    id: 10,
    question: 'Welke kleur speentje vindt Sven fijn?',
    answers: ['Blauw', 'Groen', 'Wit', 'Paars'],
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
  questions = QUIZ_QUESTIONS;
  currentQuestionIndex = 0;
  lives = 3;
  timeLeft = 10;
  timerId?: number;
  showIntro = true;
  showFailure = false;
  showSuccess = false;
  answeredCorrect = 0;
  canAnswer = false;
  showFeedback = false;
  lastAnswerCorrect = false;

  constructor(private readonly router: Router, private readonly gameState: GameStateService) {}

  ngOnInit(): void {
    // Intro shows by default; game starts after Start button.
  }

  startGame(): void {
    this.resetGame();
    this.showIntro = false;
    this.startQuestion();
  }

  resetGame(): void {
    this.clearTimer();
    this.currentQuestionIndex = 0;
    this.lives = 3;
    this.timeLeft = 10;
    this.showFailure = false;
    this.showSuccess = false;
    this.answeredCorrect = 0;
    this.canAnswer = false;
    this.showFeedback = false;
    this.lastAnswerCorrect = false;
  }

  startQuestion(): void {
    this.clearTimer();
    this.timeLeft = 10;
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
    return `Vraag ${this.currentQuestionIndex + 1}/10`;
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
      if (this.lastAnswerCorrect && this.answeredCorrect === this.questions.length) {
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
}
