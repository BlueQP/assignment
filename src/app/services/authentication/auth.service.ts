import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../../model/user.model";
import { map } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";
import { LoginResponse } from "../../model/loginResponse.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  private SERVER_URL = "http://localhost:3000";
  private API_URL_PATH = "/API";
  private AUTH_URL_PATH = "/login";
  private AUTH_URL = this.SERVER_URL + this.API_URL_PATH + this.AUTH_URL_PATH;
  private HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private httpClient: HttpClient, private router: Router) { 
    this.userSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get getUser(): User{
     return this.userSubject.value;
  }
  authenticate(userInfo:User){
      return this.httpClient.post<LoginResponse>(this.AUTH_URL, userInfo, this.HTTP_OPTIONS).pipe(map(userLogin => {
        console.log("testing info - posted: " + JSON.stringify(userInfo));
        console.log("testing info - login response: " + JSON.stringify(userLogin));
        if(userLogin.ok) {
          if (userLogin.user.valid){
            sessionStorage.setItem("user", JSON.stringify(userLogin.user));
            this.userSubject.next(userLogin.user);
            userLogin.status = true;
            userLogin.user.password = "********";
          }
          else{
            userLogin.errorMessage = "your account is banned";
          }
        }
        else {
          userLogin.errorMessage = "invalid log in credentials";
        }
        return {userLogin};
      }));
  }
}
