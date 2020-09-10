import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserHelper } from 'src/app/helpers/userHelper.helper';
import { User } from 'src/app/model/user.model';
import { Router } from '@angular/router';
import { map } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';
import { ChatGroup } from 'src/app/model/chatGroup';
import { GroupPath } from 'src/app/model/groupPath.model';
import { Long, serialize, deserialize } from 'bson';
@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private userList = [];
  private SERVER_URL = "http://localhost:3000";
  private API_URL_PATH = "/api";
  private GROUP_LIST_URI = "/group";
  private GROUP_ASSIS_LIST_URI = "/group/groupAssis";
  private GROUP_AVAILABLE_ASSIS_LIST_URI = "/group/otherAssis";
  private GROUP_MEMBER_LIST_URI = "/group/getGroupUsers"
  private GROUP_USER_OUTSIDE_URI = "/group/getUsersOutsideGroup";
  private CREATE_SUB_GROUP_URI = "/group/createSubGroup";
  private UPDATE_SUB_GROUP_URI = "/group/updateSubGroup";
  private UPDATE_ROOT_GROUP_URI = "/group/updateRootGroup";
  private CREATE_ROOT_GROUP_URI = "/group/createRootGroup";
  private DELETE_GROUP_URI = "/group/deleteGroup";
  private GROUP_LIST_URL = this.SERVER_URL + this.API_URL_PATH + this.GROUP_LIST_URI;
  private GROUP_ASSIS_LIST_URL = this.SERVER_URL + this.API_URL_PATH + this.GROUP_ASSIS_LIST_URI;
  private GROUP_AVAILABLE_ASSIS_LIST_URL = this.SERVER_URL + this.API_URL_PATH + this.GROUP_AVAILABLE_ASSIS_LIST_URI;
  private GROUP_MEMBER_LIST_URL = this.SERVER_URL + this.API_URL_PATH + this.GROUP_MEMBER_LIST_URI;
  private GROUP_USER_OUTSIDE_URL = this.SERVER_URL + this.API_URL_PATH + this.GROUP_USER_OUTSIDE_URI;
  private CREATE_SUB_GROUP_URL =  this.SERVER_URL + this.API_URL_PATH + this.CREATE_SUB_GROUP_URI;
  private UPDATE_SUB_GROUP_URL = this.SERVER_URL + this.API_URL_PATH + this.UPDATE_SUB_GROUP_URI;
  private UPDATE_ROOT_GROUP_URL = this.SERVER_URL + this.API_URL_PATH + this.UPDATE_ROOT_GROUP_URI;
  private CREATE_ROOT_GROUP_URL = this.SERVER_URL + this.API_URL_PATH + this.CREATE_ROOT_GROUP_URI;
  private DELETE_GROUP_URL = this.SERVER_URL + this.API_URL_PATH + this.DELETE_GROUP_URI;
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

  public getGroupAssis(group:ChatGroup){
    return this.httpClient.post(this.GROUP_ASSIS_LIST_URL, group, this.HTTP_OPTIONS);
  }

  public getRestGroupAssis(group:ChatGroup){
    return this.httpClient.post(this.GROUP_AVAILABLE_ASSIS_LIST_URL, group, this.HTTP_OPTIONS);
  }

  public getUsersInThisGroup(group:ChatGroup){
    return this.httpClient.post(this.GROUP_MEMBER_LIST_URL, group, this.HTTP_OPTIONS);
  }

  public getUsersOutThisGroup(group:ChatGroup){
    return this.httpClient.post(this.GROUP_USER_OUTSIDE_URL, group, this.HTTP_OPTIONS);
  }

  public createSubGroup(path: GroupPath){
    return this.httpClient.post(this.CREATE_SUB_GROUP_URL, path, this.HTTP_OPTIONS);
  }

  public updateSubGroup(path: GroupPath){
    return this.httpClient.post(this.UPDATE_SUB_GROUP_URL, JSON.stringify(path), this.HTTP_OPTIONS);
  }

  public updateRootGroup(root: ChatGroup){
    return this.httpClient.post(this.UPDATE_ROOT_GROUP_URL, root, this.HTTP_OPTIONS);
  }

  public createRootGroup(root: ChatGroup){
    return this.httpClient.post(this.CREATE_ROOT_GROUP_URL, root, this.HTTP_OPTIONS);
  }

  public deleteGroup(p:GroupPath){
    return this.httpClient.post(this.DELETE_GROUP_URL, p, this.HTTP_OPTIONS);
  }
}
