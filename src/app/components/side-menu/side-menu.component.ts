import { Component } from '@angular/core';
import { Game } from "../../interfaces/Game";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {

  openModal: boolean = false;
  game: Game = { id: null, gameFormat: null, team1: null, team2: null};

}
