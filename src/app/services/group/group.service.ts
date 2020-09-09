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
export class GroupService {
  private userList = [];
  private SERVER_URL = "http://localhost:3000";
  private API_URL_PATH = "/api";
  private GROUP_LIST_URI = "/group";
  private GROUP_LIST_URL = this.SERVER_URL + this.API_URL_PATH + 
  this.GROUP_LIST_URI;

  private HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  
  user:User;
  constructor(private httpClient:HttpClient, private userHelper:UserHelper) {
    this.userHelper.getUser().subscribe(u => this.user = u);
    this.userHelper.refreashSession();
  }

  public getAllgroups(){
    return this.httpClient.get(this.GROUP_LIST_URL);
  }
}
