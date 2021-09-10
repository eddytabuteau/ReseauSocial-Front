import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  userEmail!: FormGroup;
  reponse: any;
  email?: boolean;
  loading:boolean = false;

  constructor(private formBuilder: FormBuilder,private userService: UserService, private router: Router, private socketService: SocketService) {}

  ngOnInit(): void {
    this.initFormuserEmail()
  }

  initFormuserEmail() {
    this.userEmail = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
    });
  }
  
  onSubmitUserlogin(): void{
    const formValueUserEmail = this.userEmail?.value;

    this.loading = true;
    this.socketService.send('verif email user',formValueUserEmail);
    this.socketService.listenOnce('reponse verif email user').subscribe((data) =>{
      this.reponse = data;
      console.log(this.reponse)
      if (this.reponse.email === false){
        this.loading = false;
        this.email = false;
      }
      else{
        this.loading = false;
        this.email = this.reponse.email;
      }
    })

  }
}
