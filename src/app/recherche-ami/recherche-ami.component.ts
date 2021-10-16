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
  droitAdmin?: number;
  userListeAmis: any;
  listeAmisLook: boolean = false;
  pseudoDemandeurUpdate?: string;
  listeAmisUser?: any;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    // @ts-ignore: Object is possibly 'null'.
    this.droitAdmin = this.userService.user[0].droit
    this.rechercheAmi()
    this.search()
  }

  rechercheAmi(): void{
    this.loading = true;
    // @ts-ignore: Object is possibly 'null'.
    this.pseudoDemandeurUpdate = this.userService.user[0].pseudo

    this.socketService.send('updateDataUser',this.pseudoDemandeurUpdate);
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
        const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;invitation: boolean; search: boolean,deleteUser: boolean}[] =[]
        // @ts-ignore: Object is possibly 'null'.
        this.resRechercheUsers.forEach(element => {
          const pseudo = element.pseudo;
          const firstName = element.firstName
          const lastName = element.lastName
          const buffer = 'data:image/jpeg;base64,' + element.photo;
          const email = element.email
          const invitation = false;
          const search = false;
          const deleteUser = false;
            users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,invitation: invitation,search: search,deleteUser: deleteUser})
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
    //console.log(dataUser)
    this.users.forEach((element: { pseudo: string;invitation: boolean }) => {
      if(element.pseudo == dataUser.pseudo){
        element.invitation = true;
        // @ts-ignore: Object is possibly 'null'.
        this.socketService.send('invitation user',{dataUser:dataUser,dateUserDemendeur:this.userService.user[0].pseudo});
      }
    });
  }

  profilUser(dataUser:any): void{
    //console.log(dataUser)
    this.router.navigate(['/profil/' + dataUser.pseudo])
  }
  
  deleteUser(user: any){
    user.deleteUser = true;
    this.socketService.send('user supp',{pseudo: user.pseudo, mail:user.email});
    this.socketService.listenOnce('reponse user supp').subscribe((data) =>{
      //console.log(data)
    })
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
    
          const index = array.indexOf(this.pseudoDemandeurUpdate);
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
  
  suppListeAmisUser(pseudo: string):void{
    this.socketService.send('supprimer liste amis user',{demandeur: this.userListeAmis,receveur: pseudo});
        this.socketService.listenOnce('reponse supprimer liste amis user').subscribe((data: any) =>{
          this.listeAmis({pseudo: this.userListeAmis})
        })
  }

  back():void {
    this.listeAmisLook = false;
    clearInterval(this.intervalId)
    this.search()
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }
}
