import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserHelper } from 'src/app/helpers/userHelper.helper';
import { User } from 'src/app/model/user.model';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userList = [];
  private SERVER_URL = "http://localhost:3000";
  private API_URL_PATH = "/api";
  private USER_LIST_URI = "/user";
  private ROLE_LIST_URI = "/user/roles";
  private USER_LIST_URL = this.SERVER_URL + this.API_URL_PATH + 
  this.USER_LIST_URI;
  private ROLE_LIST_URL = this.SERVER_URL + this.API_URL_PATH + this.ROLE_LIST_URI;
  user:User;

  public userListObservable:Subject<Array<User>>;
  
  constructor(private httpClient: HttpClient, private userHelper:UserHelper, private router:Router) { 
    this.userHelper.getUser().subscribe(u => this.user = u);
    this.userHelper.refreashSession();
  }

  public getAllUsers(){
    return this.httpClient.get(this.USER_LIST_URL);
  }

  public getAllRoles(){
    return this.httpClient.get(this.ROLE_LIST_URL);
  }



  
}
