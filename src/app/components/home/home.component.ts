import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from "../../interfaces/Player";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @Input() players: Set<Player>;

  isEditMode: boolean = true;


  switchEditMode(isEditMode: boolean) {
    this.isEditMode = isEditMode;
  }

  pickPlayer( players: Set<Player> ) {
    this.players = players;
  }

}
