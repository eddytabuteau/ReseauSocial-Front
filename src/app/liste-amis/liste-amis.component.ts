import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-liste-amis',
  templateUrl: './liste-amis.component.html',
  styleUrls: ['./liste-amis.component.scss']
})
export class ListeAmisComponent implements OnInit, OnDestroy {

  users: any;
  intervalId?: any
  resRechercheUsers: unknown
  loading:boolean = false;
  resInvitation?: string;
  listeAmisConfDemandeurRecommandation: any;
  pasDamis = false;

  
  rejoindreDiscussionEncoursUser: any;
  rejoindreDiscussionEncoursNumber = 0;
  rejoindreDiscussionEncoursOn = false;

  listeRecommandationDatas?: any[];
  userRecommandationDemandeur?: string;
  userRecommandationReceveur?: any;
  pseudoRecommandationReceveur?: string;
  recommandationUser = false;
  pasDeRecommandation = false;
  user: any;
  droitAdmin?: number;
  listeAmisLook = false;
  listeAmisUser?: any;
  userListeAmis?: string;
  allUsersDiscussion = false;
  AllUsersListe?: any;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    // @ts-ignore: Object is possibly 'null'.
    this.droitAdmin = this.userService.user[0].droit
    
    this.rechercheAmi()
    this.search()
  }

  rejoindreConversationUserOn(data: any): void{
    //console.log(data)
    this.loading = true;
  const usersRejoindre = data.discussion[0].rejoindreDiscussion
  const usersRejoindrePseudo: any[] = []

  //console.log(usersRejoindre)
  if(usersRejoindre.length > 0){
    usersRejoindre.forEach((element: any) => {
      usersRejoindrePseudo.push(element.pseudoDemandeur)
    });

//console.log(usersRejoindrePseudo)
    this.socketService.send('recherche user invitation',usersRejoindrePseudo);
    this.socketService.listenOnce('reponse recherche user invitation').subscribe((data) =>{
      const users: { pseudo: string; buffer: string;firstName: string;lastName: string;search: boolean;idDiscussion: string}[] =[]
      // @ts-ignore: Object is possibly 'null'.
      data.forEach(element => {
        const pseudo = element.pseudo;
        const firstName = element.firstName
        const lastName = element.lastName
        const buffer = 'data:image/jpeg;base64,' + element.photo;
        const search = false;
        let idDiscussion = ""
        this.rejoindreDiscussionEncoursNumber++

        usersRejoindre.forEach((element: any) => {
          if(pseudo === element.pseudoDemandeur){
            idDiscussion = element.idDiscussion
          }
        });
        

          users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,search: search,idDiscussion: idDiscussion})
      });
  
      
        this.rejoindreDiscussionEncoursUser = users
        //console.log(this.rejoindreDiscussionEncoursUser)
        this.loading = false;
    })
  }
  else{
    this.loading = false;
  }


  }

  search(){
    return new Promise(
      (resolve, reject) => {
       this.intervalId = setInterval(
          () => {
            if(this.users){
          // @ts-ignore: Object is possibly 'null'.
          let pseudo = (<HTMLInputElement>document.getElementById('serchUser')?.value)
          this.users.forEach((element: { pseudo: HTMLInputElement[]; search: boolean; }) => {
            if( element.pseudo.indexOf(pseudo) == -1){
              element.search = true
            }
            else{
              element.search = false;
            }
          })
          }
        }, 50
        );
      }
    );
  }

  rechercheAmi(): void{
    if(this.userService.user){
      this.loading = true;
      // @ts-ignore: Object is possibly 'null'.
      const pseudoDemandeurUpdate = this.userService.user[0].pseudo
      this.userRecommandationDemandeur = pseudoDemandeurUpdate
  
      this.socketService.send('updateDataUser',pseudoDemandeurUpdate);
      this.socketService.listenOnce('reponse updateDataUser').subscribe((data) =>{
        //console.log(data)
        // @ts-ignore: Object is possibly 'null'.
        this.userService.userLog(data)
        // @ts-ignore: Object is possibly 'null'.
        this.listeAmisConfDemandeurRecommandation = data[0].listeUser[0].listeAmisConfirmées
        // @ts-ignore: Object is possibly 'null'.
        this.user = data[0]

        this.socketService.send('recherche user invitation',this.listeAmisConfDemandeurRecommandation);
        this.socketService.listenOnce('reponse recherche user invitation').subscribe((data) =>{
          this.resRechercheUsers = data;
          const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;search: boolean;invitation: boolean;liste: any,connexion: boolean,connexionId: string,discussion:any,rejoindreDiscussion: boolean,discussionConfirmee: boolean,discussionEnCours: any, idDiscussion: string, deleteUser: boolean,droitAdmin: number}[] =[]
          // @ts-ignore: Object is possibly 'null'.
          this.resRechercheUsers.forEach(element => {
            const pseudo = element.pseudo;
            const firstName = element.firstName
            const lastName = element.lastName
            const buffer = 'data:image/jpeg;base64,' + element.photo;
            const email = element.email
            const liste = element.listeUser[0]
            const discussion = element.discussion[0]
            const invitation = false;
            const search = false;
            const deleteUser = false;
            const connexion = element.connexion;
            const connexionId = element.socketId;
            const droitAdmin = element.droit;
            let rejoindreDiscussion = false;
            let discussionConfirmee = false;
            const discussionEnCours = discussion.discussionEncours[0]
            let idDiscussion = "";
            
            discussion.DiscussionConfirmées.forEach((element: any) => {
              //console.log(element)
              if(element.pseudo === pseudoDemandeurUpdate){
                discussionConfirmee = true;
                idDiscussion = element.idDiscussion
              }
            });

            if(discussionEnCours !== undefined){
              this.user.discussion[0].rejoindreDiscussion.forEach((element: any) => {
                if(element.pseudoDemandeur === pseudo){
                  rejoindreDiscussion = true;
                  idDiscussion = element.idDiscussion
                }
              });
            }
              users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,search: search,invitation: invitation,liste:liste,connexion: connexion,connexionId: connexionId,discussion: discussion, rejoindreDiscussion: rejoindreDiscussion,discussionConfirmee:discussionConfirmee,discussionEnCours: discussionEnCours, idDiscussion: idDiscussion, deleteUser: deleteUser,droitAdmin: droitAdmin})
          });

            
            this.loading = false;
            this.rejoindreConversationUserOn(this.user)
            this.users = users
            //console.log(users)

            if(this.users.length == 0){
              this.pasDamis = true;
            }
        })
      })
    }
    
  }

  recommandation(dataUser:any): void{
    //console.log(dataUser)
    //console.log(this.listeAmisConfDemandeurRecommandation)
    const listeRecommandation = this.listeAmisConfDemandeurRecommandation
    const indexUserReceveurRecommandation = listeRecommandation.indexOf(dataUser.pseudo);//on retire le pseudo du receveur de la recommandation
        if(indexUserReceveurRecommandation > -1){
            listeRecommandation.splice(indexUserReceveurRecommandation, 1);
        }
    this.users.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        this.userRecommandationReceveur = dataUser;
        this.pseudoRecommandationReceveur = dataUser.pseudo;
        // @ts-ignore: Object is possibly 'null'.
        const listeUser = element.liste.listeAmisConfirmées.concat(element.liste.listeAmisAttenteConf).concat(element.liste.listeAmisEnAttente);
                  //on rajoute les pseudo déjà en recommandation
                  dataUser.liste.listeAmisRecommandé.forEach((recommandation: any) => {
                    listeUser.push(recommandation.pseudoRecommandation)
              })
        // @ts-ignore: Object is possibly 'null'.
        const index = listeUser.indexOf(this.userService.user[0].pseudo);//on retire le pseudo du demandeur de la recommandation
        if (index > -1) {
          listeUser.splice(index, 1);}

          //on retire les pseudo qui sont dans la liste du receveur qui sont aussi dans la liste d'amis confirmés du demandeur
          listeUser.forEach((ami: any) => {
            const indexRecommandation = listeRecommandation.indexOf(ami);
            if( indexRecommandation > -1){
                listeRecommandation.splice(indexRecommandation, 1);

            }
            
      })    
       //avec la liste des pseudo en recommandation , on va récupérer la data de tous ces users(mail,...)
        //console.log(listeRecommandation)
        this.recommandationUser = true;
        const listeRecommandationData: any[] | undefined = []
        listeRecommandation.forEach( (userListeRecommandation: any) => {
          this.users.forEach( (userAmisDemandeur: { pseudo: any; }) =>{
            if(userListeRecommandation == userAmisDemandeur.pseudo){
              listeRecommandationData.push(userAmisDemandeur)
            }
          }
          )
        });
        this.listeRecommandationDatas = listeRecommandationData
        if(this.listeRecommandationDatas.length == 0){
          this.pasDeRecommandation = true;
        }
        clearInterval(this.intervalId)
        this.searchReco()
        //console.log(this.listeRecommandationDatas)
        this.users = []
      }
    });
  }

  profilUser(dataUser:any): void{
    //console.log(dataUser)
    this.router.navigate(['/profil/' + dataUser.pseudo])
  }

  discussion(dataUser:any): void{

    const demandeur = {
      // @ts-ignore: Object is possibly 'null'.
      mail: this.userService.user[0].email,
      // @ts-ignore: Object is possibly 'null'.
      pseudo: this.userService.user[0].pseudo,
      droit: this.droitAdmin
    }
    const receveur = {
      mail: dataUser.email,
      pseudo: dataUser.pseudo,
      droit: dataUser.droitAdmin
    }

    if(dataUser.discussionConfirmee){
      //console.log('discussion Confirmée')
      const confirm = true;
      //lancer une discussion quand l'ID est déjà créé
      this.socketService.send('creation discussion user',{demandeur:demandeur,receveur: receveur,idDiscussion: dataUser.idDiscussion,confirme: confirm});
      this.socketService.listenOnce('reponse creation discussion user').subscribe((data) =>{
        this.router.navigate(['/discussion/' + data])
        //console.log(data)
      })
    }
    else{
  
      this.socketService.send('creation discussion user',{demandeur:demandeur,receveur: receveur,idDiscussion: dataUser.connexionId,confirme: false});
      this.socketService.listenOnce('reponse creation discussion user').subscribe((data) =>{
        this.router.navigate(['/discussion/' + data])
        //console.log(data)
      })
    }
    
 
  }

  discussionRejoindre(user: any): void{
// @ts-ignore: Object is possibly 'null'.
const pseudoReceveur =  this.userService.user[0].pseudo
//rejoindre une discussion lors de sa création
      this.socketService.send('rejoindre Discussion creation',{pseudoOrigine:user.pseudo,pseudoReceveur: pseudoReceveur,idDiscussion: user.idDiscussion});
      this.socketService.listenOnce('reponse rejoindre Discussion creation').subscribe((data) =>{
        this.router.navigate(['/discussion/' + data])
        //console.log(data)
      })
  }
  

  //recommandation page
  searchReco(){
    return new Promise(
      (resolve, reject) => {
       this.intervalId = setInterval(
          () => {
            if(this.listeRecommandationDatas){
          // @ts-ignore: Object is possibly 'null'.
          let pseudo = (<HTMLInputElement>document.getElementById('serchUserReco')?.value)
          this.listeRecommandationDatas.forEach((element: { pseudo: HTMLInputElement[]; search: boolean; }) => {
            if( element.pseudo.indexOf(pseudo) == -1){
              element.search = true
            }
            else{
              element.search = false;
            }
          })
          }
        }, 50
        );
      }
    );
  }
  envoyerRecommandation(dataUser:any): void{
    //console.log(dataUser.pseudo)
    //console.log(this.userRecommandationDemandeur)
    
    const dataReceveur = {email: this.userRecommandationReceveur?.email,pseudo: this.userRecommandationReceveur?.pseudo}
    //console.log(dataReceveur)
    this.listeRecommandationDatas?.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        element.invitation = true;
        this.socketService.send('recommandation',{userRecommandation :dataUser.pseudo,userRecommandationDemandeur:this.userRecommandationDemandeur,userRecommandationReceveur: dataReceveur });
        
      }
    });

  }

  back():void {
    this.listeAmisLook = false;
    this.allUsersDiscussion = false;
    this.rejoindreDiscussionEncoursOn = false;
    clearInterval(this.intervalId)
    this.recommandationUser =false;
    this.loading = false;
    this.listeRecommandationDatas = []
    this.pasDeRecommandation = false;
    this.rechercheAmi()
    this.search()
  }

  deleteUser(user: any){
    if (confirm('Etes vous sur de supprimer le compte ?')){
      user.deleteUser = true;
      this.socketService.send('user supp',{pseudo: user.pseudo, mail:user.email});
      this.socketService.listenOnce('reponse user supp').subscribe((data) =>{
        //console.log(data)
      })
    }
   
  }


searchAmis(){
    return new Promise(
      (resolve, reject) => {
       this.intervalId = setInterval(
          () => {
            if(this.listeAmisLook){
          // @ts-ignore: Object is possibly 'null'.
          let pseudo = (<HTMLInputElement>document.getElementById('serchUserAmis')?.value)
          this.listeAmisUser.forEach((element: { pseudo: HTMLInputElement[]; search: boolean; }) => {
            if( element.pseudo.indexOf(pseudo) == -1){
              element.search = true
            }
            else{
              element.search = false;
            }
          })
          }
        }, 50
        );
      }
    );
  }

listeAmis(user: any): void{
  this.userListeAmis = user.pseudo
  clearInterval(this.intervalId)
  this.listeAmisLook = true;
  this.loading = true;
  this.socketService.send('liste amis user',this.userListeAmis);
    this.socketService.listenOnce('reponse liste amis user').subscribe((data: any) =>{

      if(data[0].listeUser[0].listeAmisConfirmées){
        const array = data[0].listeUser[0].listeAmisConfirmées
        //console.log(array)
  
        const index = array.indexOf(this.userRecommandationDemandeur);
        if (index > -1) {
          array.splice(index, 1);
        }
  
        this.socketService.send('recherche user invitation',array);
        this.socketService.listenOnce('reponse recherche user invitation').subscribe((data: any) =>{
          const userListe: { pseudo: any; firstName: any; lastName: any; buffer: string; email: any; liste: any; search: boolean; }[] = []
  
          data.forEach((element: { pseudo: any; firstName: any; lastName: any; buffer:string, photo: string; email: any; listeUser: any[]; }) => {
            const pseudo = element.pseudo;
            const firstName = element.firstName
            const lastName = element.lastName
            const buffer = 'data:image/jpeg;base64,' + element.photo;
            const email = element.email
            const liste = element.listeUser[0]
            let search = false;
  
            userListe.push({pseudo: pseudo,firstName: firstName,lastName: lastName,buffer: buffer,email:email,liste:liste,search:search})
          })
          this.searchAmis()
          this.listeAmisUser = userListe;
          this.loading = false;
          
        })
      }

    })
}

suppListeAmis(pseudo: string):void{
  this.socketService.send('supprimer liste amis user',{demandeur: this.userRecommandationDemandeur,receveur: pseudo});
      this.socketService.listenOnce('reponse supprimer liste amis user').subscribe((data: any) =>{
        this.rechercheAmi()
      })
}

suppListeAmisUser(pseudo: string):void{
  this.socketService.send('supprimer liste amis user',{demandeur: this.userListeAmis,receveur: pseudo});
      this.socketService.listenOnce('reponse supprimer liste amis user').subscribe((data: any) =>{
        this.listeAmis({pseudo: this.userListeAmis})
      })
}

searchDiscussion(){
  return new Promise(
    (resolve, reject) => {
     this.intervalId = setInterval(
        () => {
          if(this.AllUsersListe){
        // @ts-ignore: Object is possibly 'null'.
        let pseudo = (<HTMLInputElement>document.getElementById('serchUserAmisDiscussion')?.value)
        this.AllUsersListe.forEach((element: { pseudo: HTMLInputElement[]; search: boolean; }) => {
          if( element.pseudo.indexOf(pseudo) == -1){
            element.search = true
          }
          else{
            element.search = false;
          }
        })
        }
      }, 50
      );
    }
  );
}

AllUsersListeOn(): void{
  clearInterval(this.intervalId)
  this.allUsersDiscussion = true;
  this.loading = true;
  this.socketService.send('liste users admin',this.userRecommandationDemandeur);
    this.socketService.listenOnce('reponse liste users admin').subscribe((data: any) =>{

      const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;search: boolean;invitation: boolean;liste: any,connexion: boolean,connexionId: string,discussion:any,rejoindreDiscussion: boolean,discussionConfirmee: boolean,discussionEnCours: any, idDiscussion: string, deleteUser: boolean,droitAdmin: number}[] =[]

      data.forEach((element: { pseudo: any; firstName: any; lastName: any; photo: string; email: any; listeUser: any[]; discussion: any[]; connexion: any; socketId: any; droit: any; }) => {
        const pseudo = element.pseudo;
        const firstName = element.firstName
        const lastName = element.lastName
        const buffer = 'data:image/jpeg;base64,' + element.photo;
        const email = element.email
        const liste = element.listeUser[0]
        const discussion = element.discussion[0]
        const invitation = false;
        const search = false;
        const deleteUser = false;
        const connexion = element.connexion;
        const connexionId = element.socketId;
        const droitAdmin = element.droit;
        let rejoindreDiscussion = false;
        let discussionConfirmee = false;
        const discussionEnCours = discussion.discussionEncours[0]
        let idDiscussion = "";
        
        discussion.DiscussionConfirmées.forEach((element: any) => {
          if(element.pseudo === this.userRecommandationDemandeur){
            discussionConfirmee = true;
            idDiscussion = element.idDiscussion
          }
        });

        if(discussionEnCours !== undefined){
          this.user.discussion[0].rejoindreDiscussion.forEach((element: any) => {
            if(element.pseudoDemandeur === pseudo){
              rejoindreDiscussion = true;
              idDiscussion = element.idDiscussion
            }
          });
        }
          users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,search: search,invitation: invitation,liste:liste,connexion: connexion,connexionId: connexionId,discussion: discussion, rejoindreDiscussion: rejoindreDiscussion,discussionConfirmee:discussionConfirmee,discussionEnCours: discussionEnCours, idDiscussion: idDiscussion, deleteUser: deleteUser,droitAdmin: droitAdmin})
      });
          this.AllUsersListe = users
          this.loading = false;
          this.searchDiscussion()
    })
}

serchUserAmisDiscussionRejoindre(){
  return new Promise(
    (resolve, reject) => {
     this.intervalId = setInterval(
        () => {
          if(this.rejoindreDiscussionEncoursUser){
        // @ts-ignore: Object is possibly 'null'.
        let pseudo = (<HTMLInputElement>document.getElementById('serchUserAmisDiscussionRejoindre')?.value)
        this.rejoindreDiscussionEncoursUser.forEach((element: { pseudo: HTMLInputElement[]; search: boolean; }) => {
          if( element.pseudo.indexOf(pseudo) == -1){
            element.search = true
          }
          else{
            element.search = false;
          }
        })
        }
      }, 50
      );
    }
  );
}

rejoindreDisussion():void{
  clearInterval(this.intervalId)
  this.rejoindreDiscussionEncoursOn = true;
  this.serchUserAmisDiscussionRejoindre()
}

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
