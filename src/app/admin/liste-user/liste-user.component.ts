import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-liste-user',
  templateUrl: './liste-user.component.html',
  styleUrls: ['./liste-user.component.scss']
})
export class ListeUserComponent implements OnInit, OnDestroy {

  @Input() listeUsers: any;

  intervalId?: any;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    this.search()
  }

  deleteUser(user: any){
    user.deleteUser = true;
    this.socketService.send('user supp',{pseudo: user.pseudo, mail:user.email});
    this.socketService.listenOnce('reponse user supp').subscribe((data) =>{
      console.log(data)
    })
  }

  search(){
    return new Promise(
      (resolve, reject) => {
       this.intervalId = setInterval(
          () => {
            if(this.listeUsers){
          // @ts-ignore: Object is possibly 'null'.
          let pseudo = (<HTMLInputElement>document.getElementById('serchUser')?.value)
          this.listeUsers.forEach((element: { pseudo: HTMLInputElement[]; search: boolean; }) => {
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
