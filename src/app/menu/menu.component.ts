import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit,OnDestroy {

  focus:string | undefined
  id?: string;
  dataLog?: boolean;

  logConectSubscription: Subscription | undefined;
  userSubscription: Subscription | undefined;
  constructor(private socketService: SocketService,
              private userService: UserService){}

  ngOnInit(): void {
    this.logConectSubscription = this.userService.PostLogServiceSubject.subscribe((data)=>{
      this.dataLog = data;
    })
    this.userSubscription = this.userService.PostServiceSubject.subscribe((data)=>{
      this.id = data[0].pseudo
    })
    
    
  }
  
  deconnexion(): void{
    this.userService.userDeco();
  }

  onFocus(linkName: string){
    this.focus = linkName

  }

  ngOnDestroy(): void {
    this.logConectSubscription?.unsubscribe
    this.userSubscription?.unsubscribe
  }
}
