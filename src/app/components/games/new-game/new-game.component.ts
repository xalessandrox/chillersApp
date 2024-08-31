import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { Player } from "../../../interfaces/Player";
import { GameFormat } from "../../../enums/GameFormat";
import { PlayersSorterByPipe } from "../../../pipes/players-sorter-by.pipe";
import { GameService } from "../../../services/games.service";
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ToastrService } from "ngx-toastr";
import { MatIcon } from "@angular/material/icon";
import html2canvas from "html2canvas";

@Component({
  selector:'app-new-game',
  templateUrl:'./new-game.component.html',
  styleUrl:'./new-game.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[ PlayersSorterByPipe ],
  standalone:true,
  imports:[ NgIf, NgFor, JsonPipe, NgClass, PlayersSorterByPipe, MatIcon ]
})
export class NewGameComponent implements OnChanges {

  @Input() isEditMode!: boolean;
  @Input() players!: Player[];
  @Input() playersNextGame!: Player[];
  @Output() unselectPlayersNextGame: EventEmitter<Player[]> = new EventEmitter<Player[]>();
  @Output() onModeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshGames: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshPlayers: EventEmitter<void> = new EventEmitter<void>();

  game: Game = { "id":null, team1:null, team2:null, mvp:null, gameFormat:null };
  areTeamsFormed: boolean;
  protected readonly GameFormat = GameFormat;

  constructor(private sorter: PlayersSorterByPipe, private gameService: GameService, private toastrService: ToastrService) {
  }

  get playersOfNextGame() {
    return this.sorter.transform(this.playersNextGame, 'forNewGame');
  }

  get canGameStart() {
    return this.playersNextGame?.length > 3 && this.playersNextGame?.length % 2 == 0;
  }

  resetTeams() {
    this.unselectPlayersNextGame.emit();
    this.playersNextGame = [];
    this.areTeamsFormed = false;
  }

  createGame() {
    this.duplicateToCanvas();
    return;
    const numberOfPlayers = this.playersNextGame.length;
    const team1 = this.playersNextGame.slice(0, numberOfPlayers / 2);
    const team2 = this.playersNextGame.slice(numberOfPlayers / 2);
    this.game.team1 = team1;
    this.game.team2 = team2;
    this.game.gameFormat = this.getGameFormat();
    this.gameService.createGame$(this.game).subscribe({
      next:() => {
        this.playersNextGame = [];
        this.refreshGames.emit();
        this.refreshPlayers.emit();
        this.toastrService.success("", "Game successfully created");
      },
      error:(err) => {
        this.toastrService.error("Error", `Something wrong happened: ${ err.message }`)
      }
    });

  }

  duplicateToCanvas() {

    html2canvas(document.querySelector('#formed-teams')).then(canvas => {

      const url = canvas.toDataURL();
      const img = new Image();
      const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
      canvas.toBlob(function (blob) {

        ctx.drawImage(canvas, 0, 0);
        const clipboardItemInput = new ClipboardItem({ 'image/png':blob });
        navigator.clipboard.write([ clipboardItemInput ]).then();


      });
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

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes?.['playersNextGame']);
    // console.log(this.playersNextGame);
  }

}
