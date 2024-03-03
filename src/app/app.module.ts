import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
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
import { FormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { GameModalComponent } from './components/modals/game-modal/game-modal.component';
import { NewGameModalComponent } from './components/modals/new-game-modal/new-game-modal.component';

@NgModule( {
	declarations : [
		AppComponent,
		HomeComponent,
		PlayersComponent,
		GamesComponent,
		PlayersSorterByPipe,
		GamesSorterByPipe,
		GameComponent,
		SideMenuComponent,
  GameModalComponent,
  NewGameModalComponent
	],
	imports : [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		NgOptimizedImage,
		FormsModule,
		ToastrModule.forRoot( {
			preventDuplicates : true,
			resetTimeoutOnDuplicate : false,
			timeOut : 4000,
			closeButton : true,
			progressBar : true,
			progressAnimation : 'increasing',
			positionClass : 'toast-top-right'
		} )
	],
	exports : [],
	providers : [ PlayersService, GameService ],
	bootstrap : [ AppComponent ]
} )
export class AppModule {
}
