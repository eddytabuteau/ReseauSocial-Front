import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { SocketService } from './socket.service';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  user: any[] | undefined;
  users: any[] | undefined;

  resLog:boolean = false
  PostLogServiceSubject = new Subject<boolean>();
  PostLoOutgServiceSubject = new Subject<boolean>();
  PostServiceSubject = new Subject<any[]>();
  usersConnexion: unknown;

  
  userInscription = false;

  constructor(private socketService: SocketService) { }
 
  ngOnInit(): void {
  }

  addUser() {
    this.userInscription = true;
  }

  userLog(userDatas: []){
    this.user = userDatas;
    this.userInscription = true;
    this.resLog = true
    //console.log(this.user)
    this.emitPostServiceSubject()
  }

  userDeco(): void{
    this.socketService.send('deco user',this.user);
    //console.log(this.user);
    this.userInscription = false;
    this.resLog = false;
    this.user = [];
    this.emitPostServiceSubject()
  }

  emitPostServiceSubject() {
    //console.log(this.user)
    this.PostServiceSubject.next(this.user);
    this.PostLogServiceSubject.next(this.resLog);
    this.PostLoOutgServiceSubject.next(this.userInscription);
  }

  ngOnDestroy(): void {
  }
}
