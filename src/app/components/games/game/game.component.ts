import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { GameService } from "../../../services/games.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";
import { DataState } from "../../../enums/DataState";
import { Player } from "../../../interfaces/Player";
import { Outcome } from "../../../enums/Outcome";
import { GameDialogComponent } from './dialog/game-dialog.component';
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { GameFormat } from "../../../enums/GameFormat";
import { ToastrService } from "ngx-toastr";

@Component({
  selector:'app-game',
  templateUrl:'./game.component.html',
  styleUrl:'./game.component.scss',
  standalone:true,
  imports:[ NgIf, NgSwitch, NgSwitchCase, NgClass, NgStyle, NgFor, GameDialogComponent, AsyncPipe ],
  providers:[
    { provide:MAT_DIALOG_DATA, useValue:{} }
  ]
})
export class GameComponent implements OnInit {

  @Input() game: Game;
  @Input() canBeSetFinished: boolean;
  @Output() refreshPlayers: EventEmitter<void> = new EventEmitter<void>();
  @Output() refreshGames: EventEmitter<void> = new EventEmitter<void>();

  gameState$: Observable<AppState<CustomHttpResponse<Game & Player[]>>>;
  dataSubject = new BehaviorSubject<CustomHttpResponse<Game & Player[]>>(null);

  protected readonly DataState = DataState;
  protected readonly Outcome = Outcome;
  protected readonly GameFormat = GameFormat;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private gameService: GameService, private dialog: MatDialog, private toastrService: ToastrService) {

  }

  ngOnInit(): void {


    if (this.game.id) {
      this.gameState$ = this.gameService.game$(this.game.id)
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          return {
            dataState:DataState.Loaded,
            appData:response
          };
        }),
        startWith({ dataState:DataState.Loading }),
        catchError((error: string) => {
          return of({
            dataState:DataState.Error,
            error
          })
        })
      );
    }
  }

  openSaveDialog(outcome: Outcome) {
    const dialogRef = this.dialog.open(GameDialogComponent, {
      data:{ game:this.game, outcome:outcome, dialogRef:undefined }
    });
    dialogRef._containerInstance._config.data.dialogRef = dialogRef;
    dialogRef.beforeClosed().subscribe({
      next:(result) => {
        if (result) {
          this.refreshGames.emit();
          this.refreshPlayers.emit();
        } else {
          this.toastrService.clear();
        }
      },
      error:err => {
        console.log("ERR", err);
      }
    });

  }

  renderer = function (res: { game: Game, flag: 'TEAM_1' | 'TEAM_2' }) {

    if (res.game.outcome == Outcome.Team1_Wins && res.flag == 'TEAM_1') {
      return 'green';
    } else if (res.game.outcome == Outcome.Team1_Wins && res.flag == 'TEAM_2') {
      return 'red';
    } else if (res.game.outcome == Outcome.Team2_Wins && res.flag == 'TEAM_2') {
      return 'green';
    } else if (res.game.outcome == Outcome.Team2_Wins && res.flag == 'TEAM_1') {
      return 'red';
    } else if (res.game.outcome == Outcome.Draw) {
      return 'orange';
    } else if (res.game.outcome == Outcome.Scrap) {
      return 'gray';
    } else {
      return 'white';
    }
  }


}
