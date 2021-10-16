import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recommandation',
  templateUrl: './recommandation.component.html',
  styleUrls: ['./recommandation.component.scss']
})
export class RecommandationComponent implements OnInit , OnDestroy{

  users: any;
  resRechercheUsers: unknown
  intervalId?: any
  loading:boolean = false;
  resInvitation?: string;
  pasDeRecommandation = false;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    this.rechercheAmi()
    this.search()
  }

  rechercheAmi(): void{
    if(this.userService.user){
    this.loading = true;
    // @ts-ignore: Object is possibly 'null'.
    const pseudoDemandeurUpdate = this.userService.user[0].pseudo

    this.socketService.send('updateDataUser',pseudoDemandeurUpdate);
    this.socketService.listenOnce('reponse updateDataUser').subscribe((data) =>{
      // @ts-ignore: Object is possibly 'null'.
      this.userService.userLog(data)
      const listeUserRecommandé: any[] = []
      // @ts-ignore: Object is possibly 'null'.
      data[0].listeUser[0].listeAmisRecommandé.forEach(element => {
        listeUserRecommandé.push(element.pseudoRecommandation)
      });
      //console.log(listeUserRecommandé)
      this.socketService.send('recherche user recommandation',listeUserRecommandé );
      this.socketService.listenOnce('reponse recherche user recommandation').subscribe((data) =>{
        //console.log(data)
        this.resRechercheUsers = data;
        const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;invitation: boolean; search: boolean;pseudoOrigineRecommandation: string}[] =[]
        // @ts-ignore: Object is possibly 'null'.
        this.resRechercheUsers.forEach(element => {
          const pseudo = element.pseudo;
          const firstName = element.firstName
          const lastName = element.lastName
          const buffer = 'data:image/jpeg;base64,' + element.photo;
          const email = element.email
          const invitation = false;
          const search = false;
          let pseudoOrigineRecommandation = ""
            // @ts-ignore: Object is possibly 'null'.
            this.userService.user[0].listeUser[0].listeAmisRecommandé.forEach(element => {
              //console.log(element)
            if(pseudo == element.pseudoRecommandation){
              pseudoOrigineRecommandation = element.pseudoOrigineRecommandation
            }
            });
            users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,invitation: invitation,search: search,pseudoOrigineRecommandation: pseudoOrigineRecommandation})
          });
          this.loading = false;
          this.users = users
          //console.log(this.users)

          if(this.users.length == 0){
            this.pasDeRecommandation = true;
          }
      })
    })
  
  }}

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
  envoyerUneInvitation(dataUser:any): void{
    //console.log(dataUser)
    this.users.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        element.invitation = true;
        this.resInvitation = "Invitation envoyée"
        // @ts-ignore: Object is possibly 'null'.
        this.socketService.send('invitation user recommandation',{dataUser:dataUser,dataUserDemandeur:this.userService.user[0].pseudo,resInvitation: this.resInvitation});
      }
    });
  }

  ignorerUneInvitation(dataUser:any): void{
    //console.log(dataUser)
    this.users.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        element.invitation = true;
        this.resInvitation = "Recommandation ignorée"
        // @ts-ignore: Object is possibly 'null'.
        this.socketService.send('invitation user recommandation',{dataUser:dataUser,dataUserDemandeur:this.userService.user[0].pseudo,resInvitation: this.resInvitation});
        
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
