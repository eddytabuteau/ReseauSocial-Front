import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat-sujet',
  templateUrl: './chat-sujet.component.html',
  styleUrls: ['./chat-sujet.component.scss']
})
export class ChatSujetComponent implements OnInit, OnDestroy {

  loading:boolean = false;
  texteMessage = "";
  messageChat: any;
  idChat?: string;
  user: any;
  chatSubscription: Subscription | undefined;
  droitAdmin?: number;

  constructor(private route: ActivatedRoute,private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    // @ts-ignore: Object is possibly 'null'.
    this.user = this.userService.user[0]
    // @ts-ignore: Object is possibly 'null'.
    this.droitAdmin = this.userService.user[0].droit

    this.searchData()
    
    this.chatSubscription = this.socketService.listen('reponse chat').subscribe((data:any) =>{
      if(data.idChat === this.idChat){
        this.searchData()
      }
    
    })
  }

  back(): void{
    this.router.navigate(['/chat-accueil/'])
  }

  searchData(): void{
    this.idChat = this.route.snapshot.params['id'];
    this.socketService.send('chat recherche',this.idChat);
      this.socketService.listenOnce('reponse chat recherche').subscribe((data) =>{
        this.messageChat = data;
        this.loading = true;
      })
  }

  sendMessage(texte: string): void{
    this.texteMessage = ""
    this.loading = false;
    const message = {
      message:texte,
      date:new Date(),
      pseudoCreation: this.user?.pseudo,
      idChat: this.idChat,
      droitAdmin: this.user?.droit

    }
    //console.log(message)
    this.socketService.send('chat', message);
  }

  supp(message: any){
    this.loading = false;
    this.socketService.send('supprimer chat commentaire',message);
      this.socketService.listenOnce('reponse supprimer chat commentaire').subscribe((data: any) =>{
        this.searchData()
      })
  }

  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe
    
  }
}
