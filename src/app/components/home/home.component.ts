import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from "../../interfaces/Player";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @Input() players: Player[];

  isEditMode: boolean = true;


  switchEditMode(isEditMode: boolean) {
    this.isEditMode = isEditMode;
  }

  pickPlayer( players: Player[] ) {
    this.players = players;
  }

}
