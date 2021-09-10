import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {


  userlogin!: FormGroup;
  reponse: any;
  password?: boolean;
  pseudo?: boolean;
  testLog = false;
  loading:boolean = false;

  constructor(private formBuilder: FormBuilder,private userService: UserService, private router: Router, private socketService: SocketService) {}

  ngOnInit(): void {
    this.initFormUserlogin()
  }

  initFormUserlogin() {
    this.userlogin = this.formBuilder.group({
      pseudo: ['', Validators.required],
      password: ['', Validators.required,],
    });
  }
  
  onSubmitUserlogin(): void{

    this.loading = true;
    const formValueUserlogin = this.userlogin?.value;
    // console.log(formValueUserlogin)
    this.socketService.send('verif login user',formValueUserlogin);
    this.socketService.listenOnce('reponse verif login user').subscribe((data) =>{
      this.reponse = data;
      if (this.reponse.pseudo === false){
        this.loading = false;
        this.pseudo = false;
      }
      else{
        this.pseudo = this.reponse.pseudo;
        this.password = this.reponse.password;
        this.loading = false;
          if (this.pseudo === true && this.password === true){
            this.userService.userLog(this.reponse.datas)
            console.log(this.reponse.datas[0].listeUser[0])
            this.router.navigate(['/'])
          }
      }
    })
  }
}
