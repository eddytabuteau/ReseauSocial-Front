import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-invitation-en-cours',
  templateUrl: './invitation-en-cours.component.html',
  styleUrls: ['./invitation-en-cours.component.scss']
})
export class InvitationEnCoursComponent implements OnInit, OnDestroy {

  users: any;
  intervalId?: any
  resRechercheUsers: unknown
  loading:boolean = false;
  pasInvitationEncours = false;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    this.rechercheAmi()
    this.search()
  }

  rechercheAmi(): void{
    this.loading = true;
    // @ts-ignore: Object is possibly 'null'.
    const pseudoDemandeurUpdate = this.userService.user[0].pseudo

    this.socketService.send('updateDataUser',pseudoDemandeurUpdate);
    this.socketService.listenOnce('reponse updateDataUser').subscribe((data) =>{
      // @ts-ignore: Object is possibly 'null'.
      this.userService.userLog(data)
      // @ts-ignore: Object is possibly 'null'.
      const listeUserDemandeur = data[0].listeUser[0].listeAmisEnAttente

      this.socketService.send('recherche user invitation',listeUserDemandeur);
      this.socketService.listenOnce('reponse recherche user invitation').subscribe((data) =>{
        this.resRechercheUsers = data;
        const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;search: boolean}[] =[]
        // @ts-ignore: Object is possibly 'null'.
        this.resRechercheUsers.forEach(element => {
          const pseudo = element.pseudo;
          const firstName = element.firstName
          const lastName = element.lastName
          const buffer = 'data:image/jpeg;base64,' + element.photo;
          const email = element.email
          const search = false;
            users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,search: search})
          });
          this.loading = false;
          this.users = users

          if(this.users.length == 0){
            this.pasInvitationEncours = true;
          }
      })
    })
  
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

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
