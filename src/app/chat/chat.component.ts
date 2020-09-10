import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { viewClassName } from '@angular/compiler';
import { Message } from "../model/message.model";
import { User } from '../model/user.model';
import { UserHelper } from '../helpers/userHelper.helper';
import { ChatGroup } from '../model/chatGroup';
import { GroupHelper } from '../helpers/groupHelper.helper';
import { GroupService } from '../services/group/group.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessageAreaNgID') private chatMessageArea: ElementRef;
  public SERVER_URL = "http://localhost:3000";
  public IMAGE_DIR = "/static/images/";
  public DEFAULT_IMAGE_NAME = "OIP.jpg";
  public DEFAULT_IMAGE_URL = this.SERVER_URL + this.IMAGE_DIR + this.DEFAULT_IMAGE_NAME;

  public messageContent: string = "";
  messages: Message[] = [];
  ioConnection: any;
  user: User;
  public currentSelectedGroup: ChatGroup;
  public currentParticipants: Array<User>;


  constructor(private socketService: SocketService, private userHelper: UserHelper, private groupHelper: GroupHelper, private groupService: GroupService) {
    userHelper.getUser().subscribe(user => this.user = user);
    this.groupHelper.getCurrentSelectedGroup().subscribe(cg => {
      this.currentSelectedGroup = cg;
      this.groupService.getUsersInThisGroup(this.currentSelectedGroup).subscribe((members: Array<User>) => {
        this.currentParticipants = members;
      });
    });
  }

  ngOnInit(): void {
    this.initIoConnection();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private initIoConnection() {
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage().subscribe((message: Message) => {
      console.log(message);
      if (message.sendInGroup == this.currentSelectedGroup._id) {
        if (this.currentSelectedGroup.messages == null) { this.currentSelectedGroup.messages = []; }
        console.log(message);
        console.log(this.currentSelectedGroup.messages);
        this.currentSelectedGroup.messages.push(message);
      }
    });
  }

  public send() {
    if (this.messageContent) {
      var newMessage: Message = new Message();
      newMessage.messageBody = this.messageContent;
      newMessage.timestamp = new Date();
      this.userHelper.getUser();
      newMessage.sentBy = this.user;
      newMessage.sendInGroup = this.currentSelectedGroup._id;
      this.socketService.send(newMessage);
      this.messageContent = null;
    }
    else {
      console.log("no message");
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessageArea){
        this.chatMessageArea.nativeElement.scrollTop = this.chatMessageArea.nativeElement.scrollHeight;
      }
    } catch (err) { throw err; }
  }
}
