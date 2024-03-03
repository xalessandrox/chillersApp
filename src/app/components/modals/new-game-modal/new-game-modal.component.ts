import { Component, Input } from '@angular/core';
import { Game } from "../../../interfaces/Game";

@Component({
  selector: 'app-new-game-modal',
  templateUrl: './new-game-modal.component.html',
  styleUrl: './new-game-modal.component.scss'
})
export class NewGameModalComponent {

  @Input() game: Game;

  resetGameValues() {

  }

  saveGame( game: Game ) {

  }

}
