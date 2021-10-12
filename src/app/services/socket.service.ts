import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: any;
  readonly url: string = "https://reseau-social-back.herokuapp.com"

  constructor() {
    this.socket = io(this.url)
   }

  

  listen(eventName: string) {
    return new Observable((subcriber) => {
      this.socket.on(eventName, (data: any) =>{
        subcriber.next(data)
      })
    })
  }

  listenOnce(eventName: string) {
    return new Observable((subcriber) => {
      this.socket.once(eventName, (data: any) =>{
        subcriber.next(data)
      })
    })
  }

  send(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}
