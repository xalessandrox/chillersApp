import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";
import { DataState } from "../../../enums/DataState";
import { GameService } from "../../../services/games.service";
import { Game } from "../../../interfaces/Game";
import { GameFormat } from "../../../enums/GameFormat";
import { Outcome } from "../../../enums/Outcome";
import { Player } from "../../../interfaces/Player";
import { ToastrService } from "ngx-toastr";
import { GamesSorterByPipe } from '../../../pipes/games-sorter-by.pipe';
import { GameComponent } from '../game/game.component';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { GameState } from "../../../enums/GameState";
import { MatDialog } from "@angular/material/dialog";
import { GameDialogComponent } from "../../modals/game-dialog/game-dialog.component";


@Component( {
  selector : 'app-games',
  templateUrl : './games.component.html',
  styleUrl : './games.component.scss',
  standalone : true,
  imports : [ NgIf, NgSwitch, NgSwitchCase, NgFor, NgClass, FormsModule, GameComponent, AsyncPipe, DatePipe, GamesSorterByPipe ]
} )

export class GamesComponent implements OnInit {
  @Input() isEditMode: boolean;
  @Output() refreshPlayers: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild( 'gameChild' ) gameChild: GameComponent;
  gamesState$: Observable<AppState<CustomHttpResponse<Game>>>;
  dataSubject = new BehaviorSubject<CustomHttpResponse<Game>>( null );
  playersOfGame: Player[] = [];
  isReadyToSave: boolean = false;
  protected readonly DataState = DataState;
  protected readonly Outcome = Outcome;
  protected readonly GameState = GameState;
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor( private gameService: GameService, private toastr: ToastrService, private dialog: MatDialog ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.gamesState$ = this.gameService.games$()
    .pipe(
      map( response => {
        this.dataSubject.next( response );
        return {
          dataState : DataState.Loaded,
          appData : response
        };
      } ),
      startWith( { dataState : DataState.Loading } ),
      catchError( ( error: string ) => {
        return of( {
          dataState : DataState.Error,
          error
        } )
      } )
    )
  }

  openGameDialog( outcome: Outcome, game: Game ) {
    const dialogRef =  this.dialog.open( GameDialogComponent, {
      data : { game : game, outcome: outcome, dialogRef: undefined }
    } );
    dialogRef._containerInstance._config.data.dialogRef = dialogRef;
    dialogRef.beforeClosed().subscribe({
      next: (result) => {
        if(result) {
          this.loadData();
          this.updatePlayers();
        } else {
          this.toastr.clear();
        }
      },
      error: err => {
        console.log( "ERR", err );
      }
    });
  }

  updatePlayers() {
    this.refreshPlayers.emit();
  }

  getGameFormat( value: string ): string {
    let res = Object
    .values( GameFormat )
    .filter( ( val ) => val.localeCompare( value ) );
    return res[0];
  }

  showRow( index: number, $event, gameState: GameState ) {
    if (gameState === GameState.STARTED) return;
    let classToToggle = `content${ index }`;
    let elementWithToggleableClass = document.querySelector( `.${ classToToggle }` );
    elementWithToggleableClass.classList.toggle( 'hide' );
  }

}
