import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { UserHelper } from 'src/app/helpers/userHelper.helper';
import { Router } from '@angular/router';
import { Role } from 'src/app/model/role.model';
import { UserService } from 'src/app/services/user/user.service';
declare var $:any;
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.less']
})
export class UserEditComponent implements OnInit {
  public currentLoggedinUser:User;
  public selectedUser:User;
  public roleList:Array<Role>;
  public showSaveMessage:Boolean = false;
  public saveMessage:String = "";
  public saveConfirmationMessage:String;
  public proceedButtonClass:String;  

  constructor(private userHelper:UserHelper, private router:Router, private userService:UserService) {
    
  }

  ngOnInit(): void {
    this.userHelper.getUser().subscribe(u => {
      this.currentLoggedinUser = u;
      if (this.currentLoggedinUser.role.name != "Super Admin"){
        this.router.navigateByUrl("/");
      }
    });
    this.userHelper.refreashSession();

    this.userHelper.getCurrentSelectedUser().subscribe(cu => {
      this.selectedUser = cu;
      console.log(this.selectedUser);
    });
    this.userHelper.getCurrentSelectedUser();
    this.userService.getAllRoles().subscribe((rl: Array<Role>) => this.roleList = rl);
  }

  setUserRole(r:Role){
    this.selectedUser.role = r;
  }

  openSaveDialog(){
    if ((this.currentLoggedinUser._id == this.selectedUser._id) &&
    (this.selectedUser.valid == false)){
      this.saveConfirmationMessage = "WARNING: you are about to disable your own account, and you wont be able to log in after you do so. Are you sure?";
      this.proceedButtonClass = "btn-danger";
    }
    else {
      this.saveConfirmationMessage = "Proceed to save changes?";
      this.proceedButtonClass = "btn-success";
    }

    $('#saveConfirmationModal').modal();
  }

  confirmSaveUser(){
    if (this.selectedUser.valid == null){
      this.selectedUser.valid = true;
    }
    this.userService.saveUser(this.selectedUser).subscribe((updatedUser: User)=>{
      this.selectedUser = updatedUser;
      this.showSaveMessage = true;
      this.saveMessage = "user of: " + this.selectedUser.username + " saved.";
      $("#closeModalBtn").click();
      this.userService.getAllUsers().subscribe((ul:Array<User>) => {
        this.userHelper.setAllUsersList(ul);
      }
      );
    });

  }

}
