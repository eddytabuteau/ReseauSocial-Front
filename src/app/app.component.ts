import { Component ,OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'reseau-social';
  photo: any;

  test:string = 'une donnée';
  listenSubscription: Subscription | undefined;


  constructor(private socketService: SocketService){}
  ngOnInit(){
  this.listenSubscription = this.socketService.listen('test event').subscribe((data) =>{
    /** 
    // @ts-ignore: Object is possibly 'null'.
    this.photo = 'data:image/jpeg;base64,' + data.buffer;
    console.log(this.photo)
    */
   console.log(data)
  })
  }
  
  ngOnDestroy(): void {
    this.listenSubscription?.unsubscribe
  }

}
