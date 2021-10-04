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

  constructor(private route: ActivatedRoute,private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    // @ts-ignore: Object is possibly 'null'.
    this.user = this.userService.user[0]
    this.searchData()
  }

  searchData(): void{
  
      this.socketService.send('updateDataUser',this.user.pseudo);
      this.socketService.listenOnce('reponse updateDataUser').subscribe((data: any) =>{
        this.userService.userLog(data)
        this.user = data[0]
        this.chats = this.user.userChat
        this.loading = true;
      })
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
