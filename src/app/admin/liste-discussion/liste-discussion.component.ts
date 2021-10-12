import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-liste-discussion',
  templateUrl: './liste-discussion.component.html',
  styleUrls: ['./liste-discussion.component.scss']
})
export class ListeDiscussionComponent implements OnInit, OnDestroy {

  @Input() listeUsers: any;
  
  intervalId?: any;
  listeDiscu: any =[]
  listeDiscuenCours: any =[]

  listeDiscuOn = false;
  listeDiscuenCoursOn = false;

  constructor(private userService: UserService, private router: Router, private socketService: SocketService) { }

  ngOnInit(): void {
    this.search()
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

  alldiscussionenCours(data: any): void{

    data.forEach((element: any) => {
      this.listeDiscuenCours.push({pseudo: element.pseudo,idDiscussion: element.idDiscussion})
    });

    this.listeDiscuenCoursOn = true;
  }

  allDiscussions(data: any): void{
    data.forEach((element: any) => {
      this.listeDiscu.push({pseudo: element.pseudo,idDiscussion: element.idDiscussion})
    });

    this.listeDiscuOn = true;
  }

  retour(): void{
    this.listeDiscuenCours = []
    this.listeDiscu = []
    this.listeDiscuOn = false;
    this.listeDiscuenCoursOn = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId)
  }

}

