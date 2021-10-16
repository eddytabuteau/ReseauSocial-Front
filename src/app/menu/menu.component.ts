import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  droitAdmin?: number;
  suppUserSubscription: Subscription | undefined;

  logConectSubscription: Subscription | undefined;
  userSubscription: Subscription | undefined;
  constructor(private socketService: SocketService,
              private userService: UserService,
              private router: Router,){}

  ngOnInit(): void {
    this.logConectSubscription = this.userService.PostLogServiceSubject.subscribe((data)=>{
      this.dataLog = data;
    })
    this.userSubscription = this.userService.PostServiceSubject.subscribe((data)=>{
      if(data.length !== 0){
        this.id = data[0].pseudo
        this.droitAdmin = data[0].droit
      }
      
    })
    

    this.suppUserSubscription = this.socketService.listen('reponse user supp deco').subscribe((data) =>{
      if(this.id === data){
        this.deconnexion()
        this.router.navigate(['/']);
      }
    
    })
    
  }
  
  deconnexion(): void{
    this.userService.userDeco();
  }

  onFocus(linkName: string){
    this.focus = linkName

  }

  ngOnDestroy(): void {
    this.suppUserSubscription?.unsubscribe
    this.logConectSubscription?.unsubscribe
    this.userSubscription?.unsubscribe
  }
}
