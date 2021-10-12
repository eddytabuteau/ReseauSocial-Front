import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat-accueil',
  templateUrl: './chat-accueil.component.html',
  styleUrls: ['./chat-accueil.component.scss']
})
export class ChatAccueilComponent implements OnInit {

  loading:boolean = false;
  user: any;
  chats: any;
  droitAdmin?: number;

  constructor(private route: ActivatedRoute,private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    // @ts-ignore: Object is possibly 'null'.
    this.user = this.userService.user[0]
    // @ts-ignore: Object is possibly 'null'.
    this.droitAdmin = this.userService.user[0].droit
    this.searchData()
  }

  searchData(): void{

    if(this.droitAdmin === 3){
      this.socketService.send('liste users admin',this.user.pseudo);
      this.socketService.listenOnce('reponse liste users admin').subscribe((data: any) =>{
        const userChat: any[] = []
        const idChat: any[] = []
        data.forEach((user: any) => {

          if(user.userChat.length !== 0){
            user.userChat.forEach((chat: any) => {
                if(!idChat.includes(chat.idChat)){
                  userChat.push(chat);
                  idChat.push(chat.idChat)
                }
            
            });
          }
          
        });
        this.chats = userChat
        this.loading = true;
      })
    }
    else{
      this.socketService.send('updateDataUser',this.user.pseudo);
      this.socketService.listenOnce('reponse updateDataUser').subscribe((data: any) =>{
        this.userService.userLog(data)
        this.user = data[0]
        this.chats = this.user.userChat
        this.loading = true;
      })
    }      
    }

  supp(chat: any){
    this.loading = false;
    this.socketService.send('supprimer chat',chat);
      this.socketService.listenOnce('reponse supprimer chat').subscribe((data: any) =>{
        this.searchData()
      })
  }

  chatLog(chat: any){
    this.router.navigate(['/chat-sujet/' + chat.idChat])
  }
}
