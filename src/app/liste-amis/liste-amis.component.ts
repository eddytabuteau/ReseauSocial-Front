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

  listeRecommandationDatas?: any[];
  userRecommandationDemandeur?: string;
  userRecommandationReceveur?: any[];
  pseudoRecommandationReceveur?: string;
  recommandationUser = false;
  pasDeRecommandation = false;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    this.rechercheAmi()
    this.search()
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
        // @ts-ignore: Object is possibly 'null'.
        this.userService.userLog(data)
        // @ts-ignore: Object is possibly 'null'.
        this.listeAmisConfDemandeurRecommandation = data[0].listeUser[0].listeAmisConfirmées
        console.log(this.listeAmisConfDemandeurRecommandation)
  
        this.socketService.send('recherche user invitation',this.listeAmisConfDemandeurRecommandation);
        this.socketService.listenOnce('reponse recherche user invitation').subscribe((data) =>{
          this.resRechercheUsers = data;
          const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;search: boolean;invitation: boolean;liste: any}[] =[]
          // @ts-ignore: Object is possibly 'null'.
          this.resRechercheUsers.forEach(element => {
            const pseudo = element.pseudo;
            const firstName = element.firstName
            const lastName = element.lastName
            const buffer = 'data:image/jpeg;base64,' + element.photo;
            const email = element.email
            const liste = element.listeUser[0]
            const invitation = false;
            const search = false;
              users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,search: search,invitation: invitation,liste:liste})
            });
            this.loading = false;
            this.users = users
        })
      })
    }
  }

  recommandation(dataUser:any): void{
    console.log(dataUser)
    console.log(this.listeAmisConfDemandeurRecommandation)
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
        console.log(listeRecommandation)
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
        console.log(this.listeRecommandationDatas)
        this.users = []
      }
    });
  }

  profilUser(dataUser:any): void{
    console.log(dataUser)
    this.users.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        element.invitation = true;
        this.resInvitation = "Invitation acceptée"
        // @ts-ignore: Object is possibly 'null'.
        this.socketService.send('invitation reponse',{dataUserDemandeur:dataUser,dataUseReceveur:this.userService.user[0].pseudo,resInvitation: this.resInvitation});
        
      }
    });
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
    console.log(dataUser)
    this.listeRecommandationDatas?.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        element.invitation = true;
        this.socketService.send('recommandation',{userRecommandation :dataUser,userRecommandationDemandeur:this.userRecommandationDemandeur,userRecommandationReceveur: this.userRecommandationReceveur });
        
      }
    });

  }

  back():void {
    this.recommandationUser =false;
    this.loading = false;
    this.rechercheAmi()
    this.listeRecommandationDatas = []
    this.pasDeRecommandation = false;
    this.search()
  }


  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}