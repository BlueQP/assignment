import { Injectable } from '@angular/core';
import { User } from "../model/user.model";
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class UserHelper{
  public isLoggedIn:boolean;
  public isUserValid:boolean;
  public user:User;
  public selectedUser:User;
  private userObservable = new Subject<User>();
  private isLoggedInObservable = new Subject<boolean>();
  private isUserValidObservable = new Subject<boolean>(); 
  private selectedUserObservable = new Subject<User>();
  constructor() {
    
  }

  public getUser():Observable<User> {
    var userString = sessionStorage.getItem("user");
    if(userString){
        this.user = JSON.parse(userString);
        this.userObservable.next(this.user);
        this.isLoggedIn = true; 
    }
    else {
        this.isLoggedIn = false;
        this.user = null;
        this.userObservable.next(this.user);
    }
    return this.userObservable.asObservable();
  }

  public getIsUserLoggedIn():Observable<boolean>{
    this.getUser();
    this.isLoggedInObservable.next(this.isLoggedIn);
    return this.isLoggedInObservable.asObservable();
  }

  public getIsUserValid():Observable<boolean>{
    this.getUser();
    if (this.isLoggedIn){
        this.isUserValid = this.user.valid;
    }
    else {
        this.isUserValid = false;
    }
    this.isUserValidObservable.next(this.isUserValid);
    return this.isUserValidObservable.asObservable();
  }

  public refreashSession(){
    this.getUser();
    this.getIsUserLoggedIn();
    this.getIsUserValid();
  }

  public setCurrentSelectedUser(user:User){
    this.selectedUser = user;
    this.selectedUserObservable.next(this.selectedUser);
  }

  public getCurrentSelectedUser():Observable<User>{
    this.selectedUserObservable.next(this.selectedUser);
    return this.selectedUserObservable.asObservable();
  }
}
