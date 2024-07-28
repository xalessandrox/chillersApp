import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { Player } from "../../../interfaces/Player";
import { GameFormat } from "../../../enums/GameFormat";
import { PlayersSorterByPipe } from "../../../pipes/players-sorter-by.pipe";
import { GameService } from "../../../services/games.service";
import { JsonPipe, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-new-game',
    templateUrl: './new-game.component.html',
    styleUrl: './new-game.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PlayersSorterByPipe],
    standalone: true,
  imports : [ NgIf, NgFor, JsonPipe ]
})
export class NewGameComponent {

  @Input() isEditMode!: boolean;
  @Input() players!: Player[];
  @Input() playersNextGame!: Player[];
  @Output() unselectPlayersNextGame: EventEmitter<Player[]> = new EventEmitter<Player[]>();
  @Output() onModeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  game: Game = { "id" : null, team1 : null, team2 : null, mvp : null, gameFormat : null };
  protected readonly GameFormat = GameFormat;
  areTeamsMade: boolean;
  areTeamsMakeable: boolean;
  gameCanStart: boolean;

  constructor( private sorter: PlayersSorterByPipe, private gameService: GameService ) {
  }

  resetTeams() {
    this.unselectPlayersNextGame.emit( );
    this.playersNextGame = [];
    this.areTeamsMade = false;
    this.gameCanStart = false;
  }

  makeTeams() {
    this.playersNextGame = this.sorter.transform( this.playersNextGame, 'forNewGame' );
    this.gameCanStart = true;
    this.areTeamsMade = true;
  }

  createGame() {
    const numberOfPlayers = this.playersNextGame.length;
    const team1 = this.playersNextGame.slice(0, numberOfPlayers/2);
    const team2 = this.playersNextGame.slice(numberOfPlayers/2);
    this.game.team1 = team1;
    this.game.team2 = team2;
    this.game.gameFormat = this.getGameFormat();
    this.gameService.createGame$(this.game).subscribe();
    this.onModeChange.emit(false);
  }

  getGameFormat(): string {
    switch (this.playersNextGame.length) {
      case 4: return "FORMAT_2V2";
      case 6: return "Format_3V3";
      case 8: return "Format_4V4";
      case 10: return "Format_5V5";
      default: return null;
    }
  }

}
