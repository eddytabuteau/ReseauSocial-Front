import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  loading:boolean = false;
  resRechercheUsers: any;
  users: any;
  nombreUsers?: number;
  watchListe = false;
  chatsUsers: any = [];
  discussionsUsers: any = [];
  MessageProfilUsers: any = [];
  chatsUsersNumber: any;
  discussionsUsersNumber: any;
  MessageProfilUsersNumber: any;
  idChatUser: any = [];
  idDiscussionUser: any[] = []
  

  discussionsUsersListeOn = false;
  MessageProfilUsersListeOn = false;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    this.rechercheUsers();
  }

  rechercheUsers(): void{

    this.socketService.send('liste users admin',"liste Users");
    this.socketService.listenOnce('reponse liste users admin').subscribe((data) =>{
        this.resRechercheUsers = data;

        const users: { pseudo: string; buffer: string;firstName: string;lastName: string;email: string ;search: boolean;userDelete:boolean;MessageProfilNumberUser: number;discussionListe: any; discussionenCours: any; discussionNumberUser: number}[] =[]
        // @ts-ignore: Object is possibly 'null'.
        this.resRechercheUsers.forEach(element => {
          const pseudo = element.pseudo;
          const firstName = element.firstName
          const lastName = element.lastName
          const buffer = 'data:image/jpeg;base64,' + element.photo;
          const email = element.email
          const search = false;
          const userDelete = false;
          let MessageProfilNumberUser = 0;
          const discussionListe = element.discussion[0].DiscussionConfirmées
          const discussionenCours = element.discussion[0].discussionEncours       
          let discussionNumberUser = 0;

          this.chatsUserFunction(element)
          this.discussionsUsersFunction(element)
          this.MessageProfilUsersFunction(element)

            
            this.MessageProfilUsers.forEach((element: any) => {
              if(element.profilDestination === pseudo){
                MessageProfilNumberUser++
              }
            });

            this.discussionsUsers.forEach((element: any) => {
              element.interlocuteurs.forEach( (user: any) => {
                if(user === pseudo){
                  discussionNumberUser++
                }
              });
              
            });


            users.push({pseudo: pseudo,buffer: buffer, firstName: firstName,lastName: lastName,email: email,search: search,userDelete: userDelete,MessageProfilNumberUser: MessageProfilNumberUser,discussionListe: discussionListe,discussionenCours: discussionenCours,discussionNumberUser: discussionNumberUser})
          
          });
          this.nombreUsers = this.resRechercheUsers.length 
          this.chatsUsersNumber = this.chatsUsers.length
          this.discussionsUsersNumber = this.discussionsUsers.length
          this.MessageProfilUsersNumber = this.MessageProfilUsers.length
          console.log(this.chatsUsers)
          console.log(this.discussionsUsers)
          console.log(this.MessageProfilUsers)

          this.loading = true;
          this.users = users
    })
  
  }

  voirListe(): void{
    this.watchListe = true
    
  }

  deleteCompte(): void{
    // @ts-ignore: Object is possibly 'null'.
    this.socketService.send('user supp',{pseudo: this.userService.user[0].pseudo, mail:this.userService.user[0].email});
    this.socketService.listenOnce('reponse user supp').subscribe((data) =>{
      console.log(data)
      this.userService.userDeco()
      this.router.navigate(['/'])
    })
  }


  chatsUserFunction(element: any): void{
    const chats = element.userChat
    chats.forEach((chat: any) => {
      if(!this.idChatUser.includes(chat.idChat)){
        this.chatsUsers.push({idChat: chat.idChat,participants :chat.participants})
        this.idChatUser.push(chat.idChat)
      }
    });
  }
  discussionsUsersFunction(element: any): void{
    element.discussion[0].DiscussionConfirmées.forEach((discussion: any) => {
      if(!this.idDiscussionUser.includes(discussion.idDiscussion)){
        this.discussionsUsers.push({idDiscussion: discussion.idDiscussion,interlocuteurs:discussion.interlocuteurs})
        this.idDiscussionUser.push(discussion.idDiscussion)
      }
    });
  }
  MessageProfilUsersFunction(element: any): void{
    element.messageProfil.forEach((message: any) => {
        this.MessageProfilUsers.push({idMessage: message.idMessage,profilDestination: message.profilDestination})
    }); 
  }

  back(): void{
    this.watchListe = false;
    this.MessageProfilUsersListeOn = false;
    this.discussionsUsersListeOn = false;
  }

  voirListeMessage(): void{
    this.MessageProfilUsersListeOn = true;
  }

  voirListeDiscussion(): void{
    this.discussionsUsersListeOn = true;
  }
}
