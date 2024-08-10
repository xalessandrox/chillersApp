import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { Player } from "../../../interfaces/Player";
import { GameFormat } from "../../../enums/GameFormat";
import { PlayersSorterByPipe } from "../../../pipes/players-sorter-by.pipe";
import { GameService } from "../../../services/games.service";
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ToastrService } from "ngx-toastr";

@Component( {
  selector : 'app-new-game',
  templateUrl : './new-game.component.html',
  styleUrl : './new-game.component.scss',
  changeDetection : ChangeDetectionStrategy.OnPush,
  providers : [ PlayersSorterByPipe ],
  standalone : true,
  imports : [ NgIf, NgFor, JsonPipe, NgClass ]
} )
export class NewGameComponent {

  @Input() isEditMode!: boolean;
  @Input() players!: Player[];
  @Input() playersNextGame!: Player[];
  @Output() unselectPlayersNextGame: EventEmitter<Player[]> = new EventEmitter<Player[]>();
  @Output() onModeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshGames: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshPlayers: EventEmitter<void> = new EventEmitter<void>();

  game: Game = { "id" : null, team1 : null, team2 : null, mvp : null, gameFormat : null };
  areTeamsMade: boolean;
  gameCanStart: boolean;
  protected readonly GameFormat = GameFormat;

  constructor( private sorter: PlayersSorterByPipe, private gameService: GameService, private toastrService: ToastrService ) {
  }

  resetTeams() {
    this.unselectPlayersNextGame.emit();
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
    const team1 = this.playersNextGame.slice( 0, numberOfPlayers / 2 );
    const team2 = this.playersNextGame.slice( numberOfPlayers / 2 );
    this.game.team1 = team1;
    this.game.team2 = team2;
    this.game.gameFormat = this.getGameFormat();
    this.gameService.createGame$( this.game ).subscribe({
      next: () => {
        this.playersNextGame = [];
        console.log(this.playersNextGame);
        this.refreshGames.emit();
        this.refreshPlayers.emit();
        this.onModeChange.emit( false );
        this.toastrService.success("", "Game successfully created");
        },
      error: (err) => {this.toastrService.error("Error", `Something wrong happened: ${err.message}`)}
    });

  }

  getGameFormat(): string {
    switch (this.playersNextGame.length) {
      case 4:
        return "FORMAT_2V2";
      case 6:
        return "FORMAT_3V3";
      case 8:
        return "FORMAT_4V4";
      case 10:
        return "FORMAT_5V5";
      default:
        return null;
    }
  }

}
