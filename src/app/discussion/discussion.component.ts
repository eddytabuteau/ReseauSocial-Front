import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit,OnDestroy {

  loading:boolean = false;
  texteMessage = ""
  messageDiscussion: any;
  user: any;
  idDiscussion?: string;
  discussionSubscription: Subscription | undefined;
  discussionConnexionSubscription: Subscription | undefined;
  pseudoUser?: string;
  pseudoDiscussion?: string;
  userCo = false;

  
  constructor(private route: ActivatedRoute, private socketService: SocketService,private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    
    // @ts-ignore: Object is possibly 'null'.
    this.pseudoUser = this.userService.user[0].pseudo

    this.socketService.send('updateDataUser',this.pseudoUser);
    this.socketService.listenOnce('reponse updateDataUser').subscribe((data: any) =>{
      this.pseudoDiscussion = data[0].discussion[0].discussionEncours[0].pseudo
    })

    this.discussion();
    this.discussionSubscription = this.socketService.listen('reponse discussion').subscribe((data:any) =>{
      if(data.idDiscussion === this.idDiscussion){
        this.discussion()
      }
    
    })

    this.discussionConnexionSubscription = this.socketService.listen('connexion Discussion').subscribe((data:any) =>{

      if(data.idDiscussion === this.idDiscussion){
        this.userCo = data.connexion;
      }
    
    })
  }

  discussion(): void{

    this.idDiscussion = this.route.snapshot.params['id'];
    this.socketService.send('discussion user',this.idDiscussion);
    this.socketService.listenOnce('reponse discussion user').subscribe((data) =>{
      this.messageDiscussion = data;
      this.loading = true;
    })
  }

  back(): void{
    this.router.navigate(['/liste-amis/'])
  }
  
  sendMessage(texte:string): void{
    // @ts-ignore: Object is possibly 'null'.
    //console.log(this.userService.user)
    // @ts-ignore: Object is possibly 'null'.
    const pseudoDemandeur = this.userService.user[0]
    this.user = {
      pseudo: pseudoDemandeur.pseudo,
      droit: pseudoDemandeur.droit,
    }
    const messageData = (<HTMLInputElement>document.getElementById('commentaire'));
    messageData.value = ""
    this.loading = false;
    const message = {
      message:texte,
      date:new Date(),
      pseudoCreation: this.user?.pseudo,
      idDiscussion: this.idDiscussion

    }
    //console.log(message)
    this.socketService.send('discussion', message);
    
  }

  ngOnDestroy(): void {
    this.discussionSubscription?.unsubscribe
    this.discussionConnexionSubscription?.unsubscribe

    const finDiscussion = {
      // @ts-ignore: Object is possibly 'null'.
      pseudo: this.userService.user[0].pseudo,
      idDiscussion: this.idDiscussion,
      pseudoDemandeur: this.pseudoDiscussion
    }
    this.socketService.send('discussion terminée', finDiscussion);
    
  }
}
