import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

// to fetch questions data from the json we created a service called question.service
// now for fetching the json we are using http modules so we have fetched it from '@angular/common/http'
// then put this HttpClient in the app.module.ts -> imports array

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private Http: HttpClient) {}
  // now we are creating a function which will return us the fetched json
  getQuestionJson(){
    return this.Http.get<any>("assets/maths.json")
  }
}
