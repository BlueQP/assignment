<<<<<<< HEAD
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import * as io from 'socket.io-client';
import { ChatGroup } from '../model/chatGroup';
import { Message } from "../model/message.model";
import { SendMessage } from '../model/sendMessage.model';
=======
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import * as io from 'socket.io-client';
import { Message } from "../model/message.model";
>>>>>>> 5bcbd3fc9775cced4e4fa33eb812094aee542c8a

const SERVER_URL = 'http://localhost:3000';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
<<<<<<< HEAD
  private API_URL_PATH = "/api";
  private MSG_CTRL_PATH = "/message";
  private MSG_SAVE_URI = "/save";
  private MSG_SAVE_URL = SERVER_URL +　this.API_URL_PATH + this.MSG_CTRL_PATH + this. MSG_SAVE_URI;
  private HTTP_OPTIONS = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  constructor(private httpClient:HttpClient) { }
=======

  constructor() { }
>>>>>>> 5bcbd3fc9775cced4e4fa33eb812094aee542c8a

  public initSocket(){
    this.socket = io(SERVER_URL);
  }

<<<<<<< HEAD
  public saveMessage(sm:SendMessage){
    return this.httpClient.post(this.MSG_SAVE_URL, sm, this.HTTP_OPTIONS);
  }

  public send(sm:SendMessage):void{
    this.saveMessage(sm).subscribe((rootG:ChatGroup) => {
      this.socket.emit('message', sm.message);
    });
=======
  public send(message:Message):void{
    this.socket.emit('message', message);
>>>>>>> 5bcbd3fc9775cced4e4fa33eb812094aee542c8a
  }

  public onMessage():Observable<any> {
    let obv = new Observable(obv => {
      this.socket.on('message', (data:Message) => obv.next(data));
    });
    return obv;
  }
}
