import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { viewClassName } from '@angular/compiler';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessageAreaNgID') private chatMessageArea :ElementRef;


  public messageContent:string="";
  messages:string[] = [];
  ioConnection:any;

  constructor(private socketService:SocketService) { }

  ngOnInit(): void {
    this.initIoConnection();
    this.scrollToBottom();
  }

  ngAfterViewChecked(){
    this.scrollToBottom();
  }

  private initIoConnection(){
    this.socketService.initSocket();
    this.ioConnection = this.socketService.onMessage().subscribe((message:string) => {
      this.messages.push(message);
    });
  }

  public send(){
    if (this.messageContent){
      this.socketService.send(this.messageContent);
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
