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

  connexionNumbers = 0;
  inscriptionDone: boolean = false;
  connexionDone: boolean = false;
  nombreInscrits = 0;
  aProposOn = false;
  
  nombreInscritsSubscription: Subscription | undefined;
  logDisconectSubscription: Subscription | undefined;
  logConectSubscription: Subscription | undefined;

  constructor(private socketService: SocketService,
              private userService: UserService){}

  ngOnInit(): void {

    this.nombreInscritsSubscription = this.socketService.listen('nombre inscrits').subscribe((data: any) =>{
      this.nombreInscrits = data.length
      this.connexionNumbers = 0
      //console.log(data)
      if(data != null){
        data.forEach((element: any) => {
          if(element.connexion === true){
            this.connexionNumbers++
          }
        });
      }
      
    
    })
     
    //la socket va demander le nombre d'inscrtis et de connexion . La réponse va être récupérer dans les subscribtions plus haut
     this.socketService.send('connexion','demande des users');

    //ci-dessous la data récupérer lors de l'incription ou d'un log à travers un service
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

  aPropos(): void{
    this.aProposOn = true;
  }

  back(): void{
    this.aProposOn = false;
  }

  ngOnDestroy(): void {
    this.nombreInscritsSubscription?.unsubscribe
    this.logConectSubscription?.unsubscribe
    this.logDisconectSubscription?.unsubscribe
  }


}
