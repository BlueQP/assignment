import { Component } from '@angular/core';
import { UserHelper } from './helpers/userHelper.helper';
import { Router } from '@angular/router';
import { User } from './model/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'chat';
  user: User;
  isLoggedIn = false;
  private userSubscription;
  private isLoggedInSubscription;

  constructor(private userHelper:UserHelper, private router: Router){
  
  }
  
  ngOnInit(){
    this.userSubscription = this.userHelper.getUser().subscribe(user => this.user = user);
    this.isLoggedInSubscription = this.userHelper.getIsUserLoggedIn().subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        console.log(this.isLoggedIn);}
      );
    this.userHelper.refreashSession();
  }

  public logOff() {
    sessionStorage.removeItem('user');
    this.userHelper.refreashSession();
    this.router.navigateByUrl('/');
  }

  ngOnDestory(){
    this.userSubscription.unsubsribe();
    this.isLoggedInSubscription.unsubsribe();
  }
}
