import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketService } from './services/socket.service';
import { MenuComponent } from './menu/menu.component';
import { AccueilComponent } from './accueil/accueil.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatStepperModule} from '@angular/material/stepper';
import { HttpClientModule } from '@angular/common/http';
import {AngularFireStorageModule} from '@angular/fire/storage'
import { AngularFireModule } from '@angular/fire';
import { EchecInscriptionComponent } from './echec-inscription/echec-inscription.component';
import { ValidationInscriptionComponent } from './validation-inscription/validation-inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { RechercheAmiComponent } from './recherche-ami/recherche-ami.component';
import { InvitationEnCoursComponent } from './invitation-en-cours/invitation-en-cours.component';
import { InvitationAttenteConfirmationComponent } from './invitation-attente-confirmation/invitation-attente-confirmation.component';
import { ListeAmisComponent } from './liste-amis/liste-amis.component';
import { RecommandationComponent } from './recommandation/recommandation.component';
import { SingleProfilComponent } from './single-profil/single-profil.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { MonProfilComponent } from './mon-profil/mon-profil.component';
import { OrderbyPipe } from './orderby.pipe';
import { ChatCreationComponent } from './chat-creation/chat-creation.component';
import { ChatAccueilComponent } from './chat-accueil/chat-accueil.component';
import { ChatSujetComponent } from './chat-sujet/chat-sujet.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    AccueilComponent,
    InscriptionComponent,
    EchecInscriptionComponent,
    ValidationInscriptionComponent,
    ConnexionComponent,
    ResetPasswordComponent,
    LoadingSpinnerComponent,
    RechercheAmiComponent,
    InvitationEnCoursComponent,
    InvitationAttenteConfirmationComponent,
    ListeAmisComponent,
    RecommandationComponent,
    SingleProfilComponent,
    DiscussionComponent,
    MonProfilComponent,
    OrderbyPipe,
    ChatCreationComponent,
    ChatAccueilComponent,
    ChatSujetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    HttpClientModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDxtQ26PRDjD7d4PQOCmt9kv-PUDdo2KoY",
      authDomain: "reseau-social-8eb54.firebaseapp.com",
      databaseURL: "https://reseau-social-8eb54-default-rtdb.firebaseio.com",
      projectId: "reseau-social-8eb54",
      storageBucket: "reseau-social-8eb54.appspot.com",
      messagingSenderId: "738966068926",
      appId: "1:738966068926:web:c424fcf144a621171848ef",
      measurementId: "G-8X2777MK5E"
    })
  ],
  providers: [
    SocketService,
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
