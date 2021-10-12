import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AdminComponent } from './admin/admin.component';
import { ChatAccueilComponent } from './chat-accueil/chat-accueil.component';
import { ChatCreationComponent } from './chat-creation/chat-creation.component';
import { ChatSujetComponent } from './chat-sujet/chat-sujet.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { EchecInscriptionComponent } from './echec-inscription/echec-inscription.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { InvitationAttenteConfirmationComponent } from './invitation-attente-confirmation/invitation-attente-confirmation.component';
import { InvitationEnCoursComponent } from './invitation-en-cours/invitation-en-cours.component';
import { ListeAmisComponent } from './liste-amis/liste-amis.component';
import { LogGuardsGuard } from './log-guards.guard';
import { MonProfilComponent } from './mon-profil/mon-profil.component';
import { NotFoundComponent } from './admin/not-found/not-found.component';
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
  { path: 'not-found', component: NotFoundComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'recherche-ami',canActivate: [LogGuardsGuard], component: RechercheAmiComponent },
  { path: 'invitation-en-cours',canActivate: [LogGuardsGuard], component: InvitationEnCoursComponent },
  { path: 'invitation-attente-confirmation',canActivate: [LogGuardsGuard], component: InvitationAttenteConfirmationComponent },
  { path: 'liste-amis',canActivate: [LogGuardsGuard], component: ListeAmisComponent },
  { path: 'recommandation',canActivate: [LogGuardsGuard], component: RecommandationComponent },
  { path: 'profil/:id',canActivate: [LogGuardsGuard], component: SingleProfilComponent },
  { path: 'discussion/:id',canActivate: [LogGuardsGuard], component: DiscussionComponent },
  { path: 'mon-profil/:id',canActivate: [LogGuardsGuard], component: MonProfilComponent },
  { path: 'chat-sujet/:id',canActivate: [LogGuardsGuard], component: ChatSujetComponent },
  { path: 'chat-creation',canActivate: [LogGuardsGuard], component: ChatCreationComponent },
  { path: 'chat-accueil',canActivate: [LogGuardsGuard], component: ChatAccueilComponent },
  { path: 'admin',canActivate: [LogGuardsGuard], component: AdminComponent },
  { path: '**', redirectTo: 'not-found' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
