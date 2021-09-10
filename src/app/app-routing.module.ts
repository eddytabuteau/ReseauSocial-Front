import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { EchecInscriptionComponent } from './echec-inscription/echec-inscription.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { InvitationAttenteConfirmationComponent } from './invitation-attente-confirmation/invitation-attente-confirmation.component';
import { InvitationEnCoursComponent } from './invitation-en-cours/invitation-en-cours.component';
import { ListeAmisComponent } from './liste-amis/liste-amis.component';
import { RechercheAmiComponent } from './recherche-ami/recherche-ami.component';
import { RecommandationComponent } from './recommandation/recommandation.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SingleProfilComponent } from './single-profil/single-profil.component';
import { ValidationInscriptionComponent } from './validation-inscription/validation-inscription.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'echec-inscription', component: EchecInscriptionComponent },
  { path: 'validation-inscription', component: ValidationInscriptionComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'recherche-ami', component: RechercheAmiComponent },
  { path: 'invitation-en-cours', component: InvitationEnCoursComponent },
  { path: 'invitation-attente-confirmation', component: InvitationAttenteConfirmationComponent },
  { path: 'liste-amis', component: ListeAmisComponent },
  { path: 'recommandation', component: RecommandationComponent },
  { path: 'profil/:id', component: SingleProfilComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
