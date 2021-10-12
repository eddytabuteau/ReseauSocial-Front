import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HttpClient } from '@angular/common/http';
registerLocaleData(localeFr, 'fr');

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
  presentationUpdate = false;
  textPresentation = ""
  textUpdateError = false;
  selectedFile: any;
  avatarDone = false;
  id?: string;

  constructor(private route: ActivatedRoute, private socketService: SocketService,private userService: UserService,private http: HttpClient) { }

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
    
    this.id = this.route.snapshot.params['id'];
    this.socketService.send('updateDataUser',this.id);
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
    const message = reponse.messageProfil.reverse()
    this.messageProfil = message
    this.textPresentation = this.userProfilData.presentation
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
      console.log(data)
      this.messageProfilCommentaires = data
      this.loading = true;
      this.commantaires = true;
    })
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
    this.loading = false;
    console.log(post)
    this.socketService.send('supprimer message profil',{idMessage:post.idMessage,pseudo:post.profilDestination});
    this.socketService.listenOnce('reponse supprimer message profil').subscribe((data) =>{
      this.profil();
    })
  }

  updateProfil(): void {
    this.presentationUpdate = true;
  }

  updateProfilDone(): void {

    if(this.textPresentation === ""){
      this.textUpdateError =true
    }
    else{
      this.textUpdateError =false;
      this.presentationUpdate = false;
      this.socketService.send('update profil',{pseudo: this.userProfilData?.pseudo,text: this.textPresentation});

      if(this.avatarDone){
        this.avatarDone = false;

        const formData = new FormData();
        formData.append('file',this.selectedFile,this.userProfilData?.pseudo);

        // @ts-ignore: Object is possibly 'null'.
      this.http.post<any>('https://reseau-social-back.herokuapp.com:3000/file-Update',formData,{responseType: 'text'}).subscribe(
        (res)=> {
        console.log(res);
        },
        (err) => console.log(err)
      );
      }
      
    }
  }

  testUpdateAvatar(){
    const inpFile = (<HTMLInputElement>document.getElementById('photo'))
    const testPhoto = (<HTMLInputElement>document.getElementById('photoProfil'))

    
    inpFile.addEventListener('change',function(){
    // @ts-ignore: Object is possibly 'null'.
    let file = (<HTMLInputElement>document.getElementById('photo')).files[0];
    //console.log(file)


    const reader = new FileReader()
    reader.addEventListener('load',function(){
      // @ts-ignore: Object is possibly 'null'.
      testPhoto.setAttribute("src", this.result);
      testPhoto.setAttribute("alt","photo de Profil")
    })
    reader.readAsDataURL(file)
    })
  }
  uploadAvatar(event: any){
    // @ts-ignore: Object is possibly 'null'.
    let file = (<HTMLInputElement>document.getElementById('photo')).files[0];
    this.selectedFile = file
    this.avatarDone = true;
  }

  suppCommentaire(commentaire: any): void{
    this.loading = false;
    this.socketService.send('supprimer commentaire profil',commentaire._id);
    this.socketService.listenOnce('reponse supprimer commentaire profil').subscribe((data) =>{
      this.socketService.send('commentaire update',this.idMessage);
      this.socketService.listenOnce('reponse commentaire update').subscribe((data) =>{
        this.messageProfilCommentaires = data
        this.loading = true;
      })
    })
  }
}
