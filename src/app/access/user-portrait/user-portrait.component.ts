import { Component, OnInit } from '@angular/core';
import { UserHelper } from 'src/app/helpers/userHelper.helper';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user/user.service';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-user-portrait',
  templateUrl: './user-portrait.component.html',
  styleUrls: ['./user-portrait.component.less']
})
export class UserPortraitComponent implements OnInit {
  public SERVER_URL = "http://localhost:3000";
  public IMAGE_DIR = "/static/images/";
  public DEFAULT_IMAGE_NAME = "OIP.jpg";
  public DEFAULT_IMAGE_URL = this.SERVER_URL + this.IMAGE_DIR + this.DEFAULT_IMAGE_NAME;
  public loggedInUser:User;
  public fileToUpload:File;
  constructor(private userHelper:UserHelper, private userService:UserService) {
    
  }

  ngOnInit(): void {
    this.userHelper.getUser().subscribe(u => this.loggedInUser = u);
    this.userHelper.refreashSession();
  }

  handleFileInput(files: FileList){
    this.fileToUpload = files.item(0);
  }

  uploadPortrait(){
    var formdata = new FormData();
    formdata.append('portrait', this.fileToUpload);
    this.userService.uploadPortrait(formdata).subscribe((n) => {
      this.loggedInUser.portraitFileName = n['name'];
      this.userService.saveUser(this.loggedInUser).subscribe((u:User) => {
        this.loggedInUser = u;
      });
    });
  }
}
