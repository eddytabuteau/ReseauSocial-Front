import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recherche-ami',
  templateUrl: './recherche-ami.component.html',
  styleUrls: ['./recherche-ami.component.scss']
})
export class RechercheAmiComponent implements OnInit, OnDestroy {

  users: any;
  resRechercheUsers: unknown
  intervalId?: any
  loading:boolean = false;

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
      const pseudoDemandeur = data[0].pseudo
      // @ts-ignore: Object is possibly 'null'.
      const listeUserDemandeur = data[0].listeUser[0]

      this.socketService.send('recherche user',{pseudoDemandeur:pseudoDemandeur,listeUserDemandeur:listeUserDemandeur });
      this.socketService.listenOnce('reponse recherche user').subscribe((data) =>{
        this.resRechercheUsers = data;
        const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;invitation: boolean; search: boolean}[] =[]
        // @ts-ignore: Object is possibly 'null'.
        this.resRechercheUsers.forEach(element => {
          const pseudo = element.pseudo;
          const firstName = element.firstName
          const lastName = element.lastName
          const buffer = 'data:image/jpeg;base64,' + element.photo;
          const email = element.email
          const invitation = false;
          const search = false;
            users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,invitation: invitation,search: search})
          });
          this.loading = false;
          this.users = users
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
  envoyerUneInvitation(dataUser:any): void{
    console.log(dataUser)
    this.users.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        element.invitation = true;
        // @ts-ignore: Object is possibly 'null'.
        this.socketService.send('invitation user',{dataUser:dataUser,dateUserDemendeur:this.userService.user[0].pseudo});
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
