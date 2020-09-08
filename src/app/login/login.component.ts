import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { Router } from '@angular/router';
import { AuthService } from "../services/authentication/auth.service";
import { first } from "rxjs/operators";
import { UserHelper } from "../helpers/userHelper.helper";
import { LoginResponse } from "../model/loginResponse.model";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  public user: User = new User();
  public loginResponse: LoginResponse = new LoginResponse();
  public errorMessageClass = "hidden";
  private ERROR_MESSAGE_CLASS_SHOW_VALUE = "show";
  private ERROR_MESSAGE_CLASS_HIDE_VALUE = "hidden";

  constructor(private router: Router, private authService: AuthService, private userHelper:UserHelper) { }

  ngOnInit(): void {
  }

  loginSubmit(): void{
    var loginUser = null;
     this.authService.authenticate(this.user).pipe(first()).subscribe(
       data => {
         if (data.userLogin.status){
          this.loginResponse = data.userLogin;
          this.errorMessageClass = this.ERROR_MESSAGE_CLASS_HIDE_VALUE;
          this.userHelper.refreashSession();
          this.router.navigateByUrl('/chat');
         }
         else {
          this.loginResponse = data.userLogin;
          this.errorMessageClass = this.ERROR_MESSAGE_CLASS_SHOW_VALUE;
         }
       }
     );
  }
}
