import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat-creation',
  templateUrl: './chat-creation.component.html',
  styleUrls: ['./chat-creation.component.scss']
})
export class ChatCreationComponent implements OnInit,  OnDestroy {

  loading:boolean = false;
  pseudoUser?: string;
  droitUser?: string;
  listeAmisUser: any;
  users: any;
  sujetChat = "";
  participants: any = [];
  sujetDone = false;
  intervalId: any
  participantsPseudo: any = [];
  participantsDone = false;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    this.listeAmis()
    this.search()
  }

  search(){
    return new Promise(
      (resolve, reject) => {
       this.intervalId = setInterval(
          () => {
            if(this.sujetChat !== ""){
              this.sujetDone = true;
            }
            else{
              this.sujetDone = false;
            }
        }, 50
        );
      }
    );
  }

  listeAmis(): void{
    this.loading = false;
      // @ts-ignore: Object is possibly 'null'.
      this.pseudoUser = this.userService.user[0].pseudo
      // @ts-ignore: Object is possibly 'null'.
      this.droitUser = this.userService.user[0].droit
  
      this.socketService.send('updateDataUser',this.pseudoUser);
      this.socketService.listenOnce('reponse updateDataUser').subscribe((data: any) =>{
        this.listeAmisUser = data[0].listeUser[0].listeAmisConfirmées

        this.socketService.send('recherche user invitation',this.listeAmisUser);
        this.socketService.listenOnce('reponse recherche user invitation').subscribe((data:any) =>{
          const users: { pseudo: any; photo: any; participant: boolean; }[] = []
          data.forEach((element: { pseudo: any; photo: any;participant: boolean}) => {
            const user = {
              pseudo: element.pseudo,
              photo: element.photo,
              participant: false,
            }

            users.push(user)
          });
          this.users = users
          this.loading = true;
          console.log(this.users)
          
        })

  })

};

  back(): void{
    this.router.navigate(['/chat-accueil/'])
  }

  participant(user: any){
    user.participant = true;
    const participant = {
      pseudo: user.pseudo,
    }
    this.participants.push(participant)
    console.log(user)
  }

  enleverParticipant(participant: any){

    this.participants = this.participants.filter((element: any) => element.pseudo !== participant.pseudo);
    this.users.forEach((element: { pseudo: string; participant: boolean; }) => {
      if(element.pseudo === participant.pseudo){
        element.participant = false;
      }
    });
  }

  lancementChat():void{
    if(this.participants.length === 0){
      this.participantsDone = true;
    }
    else{
      this.participants.forEach((element: { pseudo: any; }) => {
        this.participantsPseudo.push(element.pseudo)
      });
      this.participantsPseudo.push(this.pseudoUser)
      const chat = {
        sujet:this.sujetChat,
        date:new Date(),
        pseudoCreation: this.pseudoUser,
        participants: this.participantsPseudo,
        droitAdmin: this.droitUser
      }

      this.socketService.send('chat creation',{chat: chat, participants: this.participantsPseudo});
        this.socketService.listenOnce('reponse chat creation').subscribe((data: any) =>{
          this.router.navigate(['/chat-sujet/' + data])
        })
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
