import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { viewClassName } from '@angular/compiler';
import { Message } from "../model/message.model";
import { User } from '../model/user.model';
import { UserHelper } from '../helpers/userHelper.helper';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessageAreaNgID') private chatMessageArea :ElementRef;


  public messageContent:string="";
  messages:Message[] = [];
  ioConnection:any;
  user:User;
  constructor(private socketService:SocketService, private userHelper:UserHelper) {
    userHelper.getUser().subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.initIoConnection();
    this.scrollToBottom();
  }

  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  private initIoConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage().subscribe((message:Message) => {
      this.messages.push(message);
    });
  }

  public send(){
    if (this.messageContent){
      var newMessage:Message = new Message();
      newMessage.messageBody = this.messageContent;
      newMessage.timestamp = new Date();
      this.userHelper.getUser();
      newMessage.sentBy = this.user;
      this.socketService.send(newMessage);
      this.messageContent = null;
    }
    else{
      console.log("no message");
    }
  }

  private scrollToBottom():void {
    try{
      this.chatMessageArea.nativeElement.scrollTop = this.chatMessageArea.nativeElement.scrollHeight;
    }catch(err){throw err;}
  }
}
