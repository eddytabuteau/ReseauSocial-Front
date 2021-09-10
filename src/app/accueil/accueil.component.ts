import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit,OnDestroy {

  connexionNumbers: unknown;
  inscriptionDone: boolean = false;
  connexionDone: boolean = false;
  
  connexionNumbersSubscription: Subscription | undefined;
  connexionNumbersDisconectSubscription: Subscription | undefined;
  logDisconectSubscription: Subscription | undefined;
  logConectSubscription: Subscription | undefined;
  constructor(private socketService: SocketService,
              private userService: UserService){}

  ngOnInit(): void {
    this.connexionNumbers = this.userService.usersConnexion
    this.connexionNumbersSubscription = this.socketService.listen('nombre connexion').subscribe((data) =>{
      this.connexionNumbers = data
    
    })
    this.connexionNumbersDisconectSubscription = this.socketService.listen('deconnexion').subscribe((data) =>{
      this.connexionNumbers = data
    })
     
     this.socketService.send('connexion','demande des users');

     this.logConectSubscription = this.userService.PostLogServiceSubject.subscribe((data)=>{
      this.connexionDone = data;
    })
    this.logDisconectSubscription = this.userService.PostLoOutgServiceSubject.subscribe((data)=>{
      this.inscriptionDone = data;
    })
    this.connexionDone = this.userService.resLog;
    this.inscriptionDone = this.userService.userInscription;
  }

  deconnexion(): void{
    this.userService.userDeco();
  }
  ngOnDestroy(): void {
    this.connexionNumbersSubscription?.unsubscribe
    this.connexionNumbersDisconectSubscription?.unsubscribe
    this.logConectSubscription?.unsubscribe
    this.logDisconectSubscription?.unsubscribe
  }
}
