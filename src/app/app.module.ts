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

@NgModule( {
	declarations : [
		AppComponent,
		HomeComponent,
		PlayersComponent,
		GamesComponent,
		PlayersSorterByPipe,
		GamesSorterByPipe,
		GameComponent
	],
	imports : [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		NgOptimizedImage,
		FormsModule
	],
	exports : [],
	providers : [ PlayersService, GameService ],
	bootstrap : [ AppComponent ]
} )
export class AppModule {
}
