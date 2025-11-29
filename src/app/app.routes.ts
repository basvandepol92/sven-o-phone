import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { GamePlaceholderComponent } from './components/game-placeholder/game-placeholder.component';
import { SvennieKruiptComponent } from './components/svennie-kruipt/svennie-kruipt.component';
import { SvennetjeSvennetjeComponent } from './components/svennetje-svennetje/svennetje-svennetje.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'start', component: StartScreenComponent },
  { path: 'game/1', component: SvennieKruiptComponent },
  { path: 'game/2', component: SvennetjeSvennetjeComponent },
  { path: 'game/:id', component: GamePlaceholderComponent },
  { path: '**', redirectTo: '' }
];
