import { Component, OnInit } from '@angular/core';
// for using viewchild we will import ViewChild, ElementRef from angular/core
import { ViewChild, ElementRef} from '@angular/core';

import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  @ViewChild('firstname') firstnamekey!: ElementRef; 
  @ViewChild('lastname') lastnamekey!: ElementRef; 
  @ViewChild('email') emailkey!: ElementRef;
  public list:any = [];
  public totalQuestions : number = 0;

  constructor(private questionService : QuestionService) { 
  }

  ngOnInit(): void {
    this.getNumberOfQuestionsOfQuiz();
  }

  // click event function on start quiz button to store all the inputs in our local storage
  startQuiz(){
    var name = this.firstnamekey.nativeElement.value + " " +  this.lastnamekey.nativeElement.value;
    localStorage.setItem("name", name);
    localStorage.setItem("email_id", this.emailkey.nativeElement.value);
  }

  getNumberOfQuestionsOfQuiz(){
    this.questionService.getQuestionJson()
    .subscribe(res=>{
      this.list = res.questions;
      this.totalQuestions = this.list.length;
    })
  }
}
