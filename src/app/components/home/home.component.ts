import { Component, Input, ViewChild } from '@angular/core';
import { Player } from "../../interfaces/Player";
import { NewGameComponent } from '../games/new-game/new-game.component';
import { GamesComponent } from '../games/games/games.component';
import { NgIf } from '@angular/common';
import { PlayersComponent } from '../players/players/players.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { environment } from "../../../environments/environment.development";

@Component( {
  selector : 'app-home',
  templateUrl : './home.component.html',
  styleUrl : './home.component.scss',
  standalone : true,
  imports : [ SideMenuComponent, PlayersComponent, NgIf, GamesComponent, NewGameComponent ]
} )
export class HomeComponent {

  @Input() players: Player[];
  playersNextGame: Player[];
  @ViewChild( 'playersComponent' ) playersComponent: PlayersComponent;
  @ViewChild( 'gamesComponent' ) gamesComponent: GamesComponent;
  isNewGameMode: boolean = true;


  switchEditMode( isEditMode: boolean ) {
    this.isNewGameMode = isEditMode;
  }


  sendPlayersNextGameToNewGame( players: Player[] ) {
    this.playersNextGame = players;
  }

  unselectPlayersNextGame() {
    this.playersComponent._unselectPlayersNextGame();

  }

  refreshGames() {
    this.gamesComponent?.loadData();
  }

  refreshPlayers() {
    this.playersNextGame = []; // This one is only needed from NewGameComponent
    this.playersComponent.loadData();
    this.playersComponent.changeDetectorRef.detectChanges();
  }

  protected readonly environment = environment;
}
