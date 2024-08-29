import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PlayersComponent } from './components/players/players/players.component';
import { PlayersService } from "./services/players.service";
import { GamesComponent } from './components/games/games/games.component';
import { PlayersSorterByPipe } from "./pipes/players-sorter-by.pipe";
import { GameService } from "./services/games.service";
import { GameComponent } from './components/games/game/game.component';
import { NgOptimizedImage } from "@angular/common";
import { GamesSorterByPipe } from "./pipes/games-sorter-by.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { NewGameComponent } from './components/games/new-game/new-game.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import { AddPlayerDialogComponent } from './components/side-menu/dialog/add-player-dialog/add-player-dialog.component';
import { MatError, MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { GameDialogComponent } from "./components/games/game/dialog/game-dialog.component";

@NgModule( {
  declarations : [ AppComponent, AddPlayerDialogComponent ],
  exports : [],
  bootstrap : [ AppComponent ], imports:[
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgOptimizedImage,
    FormsModule,
    ToastrModule.forRoot({
      preventDuplicates:true,
      resetTimeoutOnDuplicate:false,
      timeOut:3000,
      closeButton:true,
      progressBar:false,
      progressAnimation:'increasing',
      positionClass:'toast-bottom-right'
    }),
    HomeComponent,
    PlayersComponent,
    GamesComponent,
    PlayersSorterByPipe,
    GamesSorterByPipe,
    GameComponent,
    SideMenuComponent,
    GameDialogComponent,
    NewGameComponent,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatInput,
    MatDialogClose,
    ReactiveFormsModule,
    MatError
  ],
  providers : [
    PlayersService,
    GameService,
    provideHttpClient( withInterceptorsFromDi() ),
    provideAnimationsAsync(),
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        width: '65%',
        minHeight: '25%',
        maxHeight: '50%',
        enterAnimationDuration: '250ms',
        exitAnimationDuration: '125'
      }
    }
  ]
} )
export class AppModule {
}
