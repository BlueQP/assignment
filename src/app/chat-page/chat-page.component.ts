import { Component, OnInit } from '@angular/core';
import { UserHelper } from '../helpers/userHelper.helper';
import { User } from '../model/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.less']
})
export class ChatPageComponent implements OnInit {
  public user:User;
  public isLoggedIn:boolean = false;

  constructor(private userHelper:UserHelper, private router:Router) { }

  ngOnInit(): void {
    this.userHelper.getUser().subscribe(u => this.user = u);
    this.userHelper.getIsUserLoggedIn().subscribe(isLoggedIn => {
      if (isLoggedIn){
        this.isLoggedIn = isLoggedIn;
      }
      else{
        this.router.navigateByUrl("/");
      }
    }) 
  }

}
