import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() { }

  public initSocket(){
    this.socket = io(SERVER_URL);
  }

  public send(message:string):void{
    this.socket.emit('message', message);
  }

  public onMessage():Observable<any> {
    let obv = new Observable(obv => {
      this.socket.on('message', (data:string) => obv.next(data));
    });
    return obv;
  }
}
