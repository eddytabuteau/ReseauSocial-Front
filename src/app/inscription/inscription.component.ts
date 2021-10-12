import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../model/utilisateur-model';
import { SocketService } from '../services/socket.service';
import { HttpClient } from '@angular/common/http';


import { AngularFireStorage } from '@angular/fire/storage';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class InscriptionComponent implements OnInit {
  isMobile:boolean = false;
  innerWidth: number | undefined;
  emaildispo = true;
  pseudodispo = true;
  testDispo = false;
  selectedFile!: File;
  loading:boolean = false;

  userData!: FormGroup;
  userPresentation!: FormGroup;
  userPhoto!: FormGroup;
  userEnregistrement!: FormGroup;

  constructor(private formBuilder: FormBuilder,private userService: UserService, private router: Router, private socketService: SocketService, private http: HttpClient,private af: AngularFireStorage) {}

  ngOnInit(): void {
    this.onResize();

    this.initFormData()
    this.initFormPresentation()
    this.initFormPhoto()
    this.initFormEnregistrement()
  }

  onResize(): void {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 992){
      this.isMobile = true;
    }
  }
  //step 1
  initFormData() {
    this.userData = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],//revoir la regex
      lastName: ['', [Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],//revoir la regex
      age: ['', [Validators.required,Validators.min(1)]],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
    });
  }

  onSubmitData() {
    // console.log(this.userData.value)
  }
  //step 2
initFormPresentation() {
    this.userPresentation = this.formBuilder.group({
      presentation: ['',[Validators.required, Validators.pattern(/^[^\s]+(\s+[^\s]+)*$/)]],
    });
  }

  onSubmitPresentation() {
    // console.log(this.userPresentation.value)
  }
  //step 3
  initFormPhoto() {
    this.userPhoto = this.formBuilder.group({
      photo: ['',Validators.required],
    });
  }
  test(){
    const inpFile = (<HTMLInputElement>document.getElementById('photo'))
    const testPhoto = (<HTMLInputElement>document.getElementById('photoProfil'))

    
    inpFile.addEventListener('change',function(){
    // @ts-ignore: Object is possibly 'null'.
    let file = (<HTMLInputElement>document.getElementById('photo')).files[0];
    //console.log(file)


    const reader = new FileReader()
    reader.addEventListener('load',function(){
      // @ts-ignore: Object is possibly 'null'.
      testPhoto.setAttribute("src", this.result);
      testPhoto.setAttribute("alt","photo de Profil")
      testPhoto.style.opacity="1"
    })

    reader.readAsDataURL(file)
    })
  }

  onFileSelected(event: any){
    // @ts-ignore: Object is possibly 'null'.
    let file = (<HTMLInputElement>document.getElementById('photo')).files[0];
    this.selectedFile = file
    
     /**
    const reader = new FileReader()
    reader.readAsBinaryString(this.selectedFile);
    reader.onload = (event) => {
     
      let bytes
      if (reader.result instanceof ArrayBuffer) {
      bytes = new Uint8Array(reader.result)
      this.socketService.send('new user',{ image: true, buffer: bytes });
      console.log(bytes)
      }
      
    };  
       */ 
  }

  onSubmiPhoto(){

  }
  //step 4

  initFormEnregistrement() {
    this.userEnregistrement = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pseudo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_.-]*$/),Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.pattern(/^\S*$/),Validators.minLength(8)]],
     
    });
  }

  onSubmitEnregistrement() {


    const formValueData = this.userData?.value;
    const formValuePresentation = this.userPresentation?.value;
    const formValueEnregistrement = this.userEnregistrement?.value;
    const newUser = new User(
      formValueData['firstName'],
      formValueData['lastName'],
      formValueEnregistrement['email'],
      formValueData['age'],
      formValueData['gender'],
      formValueData['nationality'],
      formValuePresentation['presentation'],
      formValueEnregistrement['pseudo'],
      formValueEnregistrement['password'],
      2,
      [{listeAmisConfirmées:[],
        listeAmisAttenteConf:[],
        listeAmisEnAttente:[],
        listeAmisRecommandé:[],
      }],
      [{DiscussionConfirmées:[],
        discussionEncours:[],
        rejoindreDiscussion:[]
      }],
      [],
      [],
      false,
      '',
    );
    // console.log(newUser)
    this.loading = true;
    this.socketService.send('verif new user',newUser);
    this.socketService.listenOnce('reponse verif new user').subscribe((data) =>{
      this.testDispo=true;
     // console.log(data)
    // @ts-ignore: Object is possibly 'null'.
     this.emaildispo = data.email;
     // @ts-ignore: Object is possibly 'null'.
     this.pseudodispo = data.pseudo

     console.log(this.emaildispo,this.pseudodispo)
     this.loading = false;
     if(this.emaildispo === true && this.pseudodispo === true){
      this.loading = true;
      //envoi de la photo avec le pseudo(unique) au serveur via une requete HTTP POST
      const formData = new FormData();
      formData.append('file',this.selectedFile,newUser.pseudo);
      
      // @ts-ignore: Object is possibly 'null'.
      this.http.post<any>('https://reseau-social-back.herokuapp.com:3000/file',formData,{responseType: 'text'}).subscribe(
        (res)=> {
          // console.log(res);
          this.socketService.send('new user',newUser);
          this.userService.addUser();
          this.loading = false;
          this.router.navigate(['/validation-inscription']);
        },
        (err) => this.router.navigate(['/echec-inscription'])
      );
      }
    })
    
    

  }


  //step 5
}
