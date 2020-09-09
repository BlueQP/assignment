import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/model/user.model';
import { UserHelper } from 'src/app/helpers/userHelper.helper';

@Component({
  selector: 'app-user-sub-list',
  templateUrl: './user-sub-list.component.html',
  styleUrls: ['./user-sub-list.component.less']
})
export class UserSubListComponent implements OnInit {
  public userList: Array<User>;
  public currentSelectedUser: User;
  constructor(private userService:UserService, private userHelper:UserHelper) {
    this.refreshUserList();
    this.userHelper.getAllUsersList().subscribe(ul => this.userList = ul);
  }

  ngOnInit(): void {
  }

  selectUser(user:User){
    this.currentSelectedUser = user;
    this.userHelper.setCurrentSelectedUser(this.currentSelectedUser);
  }
  createUser(){
    this.currentSelectedUser = new User();
    this.userHelper.setCurrentSelectedUser(this.currentSelectedUser);
  }

  refreshUserList(){
    this.userService.getAllUsers().subscribe((ul: Array<User>) =>{
      this.userList = ul;
      this.userHelper.setAllUsersList(this.userList);
    })
  }
}
