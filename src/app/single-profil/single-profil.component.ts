import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-single-profil',
  templateUrl: './single-profil.component.html',
  styleUrls: ['./single-profil.component.scss']
})
export class SingleProfilComponent implements OnInit {

  loading:boolean = false;
  user?: { pseudo: string; droit: number; photo: any; };
  userProfilData?: { firstName: string; lastName: string; age: number; gender: string; nationality: string; presentation: string; pseudo: string; droit: number; listeUser: []; photo: string;mail:string };
  texte: string = ''
  texteCommentaire: string = ''
  messageProfil?:any;
  commantaires: boolean = false;
  messageProfilCommentaires?:any;
  idMessage?: string;

  constructor(private route: ActivatedRoute, private socketService: SocketService,private userService: UserService,) { }

  ngOnInit(): void {
    this.profil()
  }

  profil():void {
    
    if(!this.user){
      // @ts-ignore: Object is possibly 'null'.
      const pseudoDemandeur = this.userService.user[0]
      this.user = {
        pseudo: pseudoDemandeur.pseudo,
        droit: pseudoDemandeur.droit,
        photo: pseudoDemandeur.photo,
      }
    }
    
    const pseudoUser: string = this.route.snapshot.params['id'];
    this.socketService.send('updateDataUser',pseudoUser);
    this.socketService.listenOnce('reponse updateDataUser').subscribe((data) =>{
      // @ts-ignore: Object is possibly 'null'.
    const reponse = data[0]
    this.userProfilData = {
      firstName: reponse.firstName,
      lastName: reponse.lastName,
      age: reponse.age,
      gender: reponse.gender,
      nationality: reponse.nationality,
      presentation: reponse.presentation,
      pseudo: reponse.pseudo,
      droit: reponse.droit,
      listeUser: reponse.listeUser,
      photo: 'data:image/jpeg;base64,' + reponse.photo,
      mail:reponse.email
    }
    this.messageProfil = reponse.messageProfil
    this.loading = true;
    console.log(this.userProfilData)

    })
  }

  send(texte:string): void{
    const message = (<HTMLInputElement>document.getElementById('post'));
    message.value = ""
    this.texte=""
    this.loading = false;
    const post = {
      message:texte,
      date:new Date(),
      pseudoCreation: this.user?.pseudo,
      photoCreation: this.user?.photo,
      droitAdmin: 3,
      profilDestination:this.userProfilData?.pseudo
    }

    this.socketService.send('messages publics',{post:post,mail:this.userProfilData?.mail});
    this.socketService.listenOnce('reponse messages publics').subscribe((data) =>{
      this.profil();
    })
    
  }

  commentaire(post: any): void{
    this.loading = false;
    this.idMessage = post.idMessage
    
    this.socketService.send('commentaire update',this.idMessage);
    this.socketService.listenOnce('reponse commentaire update').subscribe((data) =>{
      this.messageProfilCommentaires = data
      this.loading = true;
      this.commantaires = true;
    })
    console.log(this.messageProfilCommentaires)
  }

  sendCommentaire(texte:string): void{
    const commentaireId = (<HTMLInputElement>document.getElementById('commentaire'));
    commentaireId.value = ""
    this.loading = false;
    const commantaire = {
      commentaire:texte,
      date:new Date(),
      pseudoCreation: this.user?.pseudo,
      photoCreation: this.user?.photo,
      idMessage: this.idMessage

    }
    console.log(this.idMessage)
    this.socketService.send('commentaire',{commentaire:commantaire,mail:this.userProfilData?.mail});
    this.socketService.listenOnce('reponse commentaire').subscribe((data) =>{
      this.socketService.send('commentaire update',this.idMessage);
      this.socketService.listenOnce('reponse commentaire update').subscribe((data) =>{
        this.messageProfilCommentaires = data
        this.loading = true;
      })
      
    })
    
  }

  back(): void{
    this.texteCommentaire=""
    this.commantaires = false;
    this.idMessage = ""
    this.messageProfilCommentaires = []
  }
  supp(post: any): void{

  }
}
