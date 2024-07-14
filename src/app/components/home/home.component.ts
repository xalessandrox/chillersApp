import { Component, Input } from '@angular/core';
import { Player } from "../../interfaces/Player";
import { NewGameComponent } from '../games/new-game/new-game.component';
import { GamesComponent } from '../games/games/games.component';
import { NgIf } from '@angular/common';
import { PlayersComponent } from '../players/players/players.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true,
    imports: [SideMenuComponent, PlayersComponent, NgIf, GamesComponent, NewGameComponent]
})
export class HomeComponent {

  @Input() players: Player[];
  pickedPlayer: Player;
  isEditMode: boolean = true;

  switchEditMode( isEditMode: boolean ) {
    this.isEditMode = isEditMode;
  }

  pickPlayers( players: Player[] ) {
    this.players = players;
  }

  sendPlayerToComponent( player: Player ) {
    this.pickedPlayer = { ...player }
  }

}
