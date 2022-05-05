import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../services/question.service';
import { ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  @ViewChild('usercomment') usercomment!: ElementRef; 
  public feedback : string = "";
  saveFeedback(){
    this.feedback = this.usercomment.nativeElement.value;
    console.log(this.feedback);
    localStorage.setItem("feedback", this.feedback);
  }


  public name : string = "";
  public questionlist : any = [];

  public currentQuestion : number = 0;
  public totalQuestions : number = 0;
  public points : number = 0;

  public correctNoOfAnswers : number = 0;
  public incorrectNoOfAnswers : number = 0;

  interval$: any;

  public progress: number = 0;
  public totaltime : number = 0;
  public perquestime: number = 0;
  public counter : number = 0;
  constructor(private questionService : QuestionService) { }

  public isquizcompleted: boolean = false;
  ngOnInit(): void {
    this.name = localStorage.getItem("name")!; // here ! is important, otherwise it will throw an error bcoz of typescript and null is not assignable in the string
    this.getAllQuestions(); // if we want any function to work whenever the component is called then it must be called inside ngOnInit
    // to start the counter of all of our quiz
    // this.startCounter();
  }

  getAllQuestions(){
    // what is subscribe method inside getQuestionJson() (also foreach and pipe also)
    // go to question service to check how we are using get method to fetch json
    // then from that service we are taking that output json inside subscribe method in res as object of promise
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.questionlist = res.questions;
      this.totalQuestions = this.questionlist.length;
      this.perquestime = res.timeperquestion; // getting per question given time from the questions json only
      this.totaltime = res.totaltimeoftest + 1000;
    })
  }

  nextQuestion(){
    if(this.currentQuestion < this.totalQuestions-1){
      this.currentQuestion++;
    }
  }

  previousQuestion(){
    if(this.currentQuestion > 0){
      this.currentQuestion--;
    }
  }

  answer(currentQno: number, option: any){
    // here we are taking the argument of current question and the option choosen whether that option has correct value or not; on the basis of it points will be distributed
    if(option.correct) {
      this.points += 10;
      this.getProgressPercent();
      this.correctNoOfAnswers++;
      if(this.currentQuestion < this.totalQuestions-1){
        this.currentQuestion++;
      }
    }
    else{
      this.points -= 10;
      this.getProgressPercent();
      this.incorrectNoOfAnswers++;
      if(this.currentQuestion < this.totalQuestions-1){
        this.currentQuestion++;
      }
    }
    if(this.currentQuestion <= this.totalQuestions){
          this.counter = this.perquestime;
    }
  }


  startCounter(){
     //its imported from rxjs library to move the counter in the interval of 1second or 1000 milisecond
    this.counter = this.perquestime;
    this.currentQuestion = 0;
    this.progress=0;
    this.interval$ = interval(1500)
    .subscribe(val=>{
      this.counter--;
      if(this.counter === 0){
        if(this.currentQuestion < this.totalQuestions-1){
          this.currentQuestion++;
        }
        this.counter = this.perquestime;
        this.points-=10;
      }
    });
    // we are getting the total time of the test from the json question file
    // after given minutes the interval clock will stop as the test will be over so the clock will be unsubscribed after settimeout of 10min
    setTimeout(()=>{
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter(){
    this.interval$.unsubscribe();
  }
  resetCounter(){
    this.stopCounter();
    // this.counter = 60;
    this.currentQuestion = 0;
  }

  // stopQuiz(){
  //   this.stopCounter();
  // }


  // to reset the quiz
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.progress=0;
    this.points=0;
    this.counter=0;
  }

  getProgressPercent(){
    var cq = this.currentQuestion + 1
    this.progress = ((cq/ this.totalQuestions)*100);
    if(this.progress === 100){
      this.stopCounter();
      console.log(this.correctNoOfAnswers);
      console.log(this.incorrectNoOfAnswers);
      this.isquizcompleted = true;
    } 
    return this.progress;
  }
}
