import { Component, OnInit, HostListener } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stroop-easy',
  templateUrl: './stroop-easy.component.html',
  styleUrls: ['./stroop-easy.component.css']
})
export class StroopEasyComponent implements OnInit {
  red = false;
  green = false;
  blue = false;
  yellow = false;
  redClass = false;
  greenClass = false;
  blueClass = false;
  yellowClass = false;
  answerFeedback: string;
  numOfCorrectAnswers = 0;
  numOfIncorrectAnswers = 0;
  testActive = false;
  testTimer: number;
  testResults = false;
  resultScreenMessage: string;
  errorMessage: any;

  constructor(
    private leaderboardService: LeaderboardService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {}

  goBack() {
    this.router.navigateByUrl('/');
  }

  randomizer(): number {
    return Math.floor(Math.random() * 4);
  }

  randomPick() {
    const pick = this.randomizer();
    const classPick = this.randomizer();

    this.setAllFalse();
    this.randomColorClass(classPick);
    this.randomColorWord(pick);
  }

  randomColorWord(pick: number) {
    switch (pick) {
      case 0:
        this.red = true;
        break;
      case 1:
        this.green = true;
        break;
      case 2:
        this.blue = true;
        break;
      case 3:
        this.yellow = true;
        break;
      default:
        break;
    }
  }

  randomColorClass(classPick: number) {
    switch (classPick) {
      case 0:
        this.redClass = true;
        break;
      case 1:
        this.greenClass = true;
        break;
      case 2:
        this.blueClass = true;
        break;
      case 3:
        this.yellowClass = true;
        break;
      default:
        break;
    }
  }

  setAllFalse() {
    this.red = false;
    this.blue = false;
    this.green = false;
    this.yellow = false;
    this.redClass = false;
    this.blueClass = false;
    this.greenClass = false;
    this.yellowClass = false;
  }

  beginTest() {
    if (!this.testActive) {
      this.beginTimer(30);
      this.randomPick();
    }
    this.testActive = true;
  }

  beginTimer(time: number) {
    this.testTimer = time;
    const newClock = setInterval(() => this.timerTick(newClock), 1000);
  }

  timerTick(newClock: any) {
    if (this.testTimer > 0) {
      this.testTimer--;
    } else {
      this.testComplete(newClock);
    }
  }

  @HostListener('document: keypress', ['$event'])
  handleAnswer(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.beginTest();
    }

    if (this.testActive) {
      if (this.numOfIncorrectAnswers > 9) {
        this.testTimer = 0;
      } else {
        switch (event.key) {
          case 'r':
            if (this.red) {
              this.correctAnswerChosen();
            } else {
              this.incorrectAnswerChosen();
            }
            this.randomPick();
            break;
          case 'g':
            if (this.green) {
              this.correctAnswerChosen();
            } else {
              this.incorrectAnswerChosen();
            }
            this.randomPick();
            break;
          case 'b':
            if (this.blue) {
              this.correctAnswerChosen();
            } else {
              this.incorrectAnswerChosen();
            }
            this.randomPick();
            break;
          case 'y':
            if (this.yellow) {
              this.correctAnswerChosen();
            } else {
              this.incorrectAnswerChosen();
            }
            this.randomPick();
            break;
          default:
            // nothing
            break;
        }
      }
    }
  }

  correctAnswerChosen() {
    this.answerFeedback = 'Correct!';
    this.numOfCorrectAnswers++;
  }

  incorrectAnswerChosen() {
    this.answerFeedback = 'Miss';
    this.numOfIncorrectAnswers++;
  }

  testComplete(newClock: any) {
    clearInterval(newClock);
    this.testActive = false;
    this.testResults = true;
    const correct = this.numOfCorrectAnswers;
    if (correct >= 0 && correct < 10) {
      this.resultScreenMessage = 'Good try!';
    } else if (correct >= 10 && correct < 20) {
      this.resultScreenMessage = 'Not bad!';
    } else if (correct >= 20 && correct < 30) {
      this.resultScreenMessage = 'Mad decent!';
    } else if (correct >= 30 && correct < 40) {
      this.resultScreenMessage = 'Great job!!';
    } else if (correct >= 40 && correct < 50) {
      this.resultScreenMessage = '♪ Most excellent ♪';
    } else if (correct >= 50 && correct < 60) {
      this.resultScreenMessage = 'Wicked!'; // easter eggs start here
    } else if (correct >= 60 && correct < 66) {
      this.resultScreenMessage = 'Blazing fast!';
    } else if (correct === 66) {
      this.resultScreenMessage = 'Hail satin!';
    } else {
      this.resultScreenMessage = 'Amazing!!';
    }

    const userId = this.userService.getUserId();

    if (userId != null) {
      const scoreObject = {
        quizScore: correct,
        user: {
          id: userId
        },
        quiz: 'Stroop Test - Easy'
      };
      this.leaderboardService.onCreateEntry(scoreObject).subscribe();
    } else {
      this.router.navigateByUrl('/login');
      alert('You are not logged in!');
    }
  }

  tryAgain() {
    this.testResults = false;
    this.answerFeedback = '';
    this.numOfCorrectAnswers = 0;
    this.numOfIncorrectAnswers = 0;
  }
}
