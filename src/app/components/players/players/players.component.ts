import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { PlayersService } from "../../../services/players.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { Player } from "../../../interfaces/Player";
import { DataState } from "../../../enums/DataState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";
import { PlayersSorterByPipe } from "../../../pipes/players-sorter-by.pipe";
import { Game } from "../../../interfaces/Game";
import { ToastrService } from "ngx-toastr";
import { AsyncPipe, JsonPipe, NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrl: './players.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PlayersSorterByPipe],
    standalone: true,
  imports : [ NgIf, NgSwitch, NgSwitchCase, NgFor, NgStyle, NgClass, AsyncPipe, PlayersSorterByPipe, JsonPipe ]
})
export class PlayersComponent implements OnInit {

	protected readonly DataState = DataState;
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	playersState$: Observable<AppState<CustomHttpResponse<Player>>>;
	dataSubject = new BehaviorSubject<CustomHttpResponse<Player[] & Game>>( null );

  _playersNextGame: Player[] = [];
  playersNotAvailable: Player[]	= [];
	@Input() isEditMode: boolean;
  @Input() playersNextGameReset!: Player[];
  @Input() playersNextGame: Player[];
	@Output() switchEditMode: EventEmitter<boolean> = new EventEmitter<boolean>;
  @Output() playersNextGameEmitter: EventEmitter<Player[]> = new EventEmitter<Player[]>;
	isLoading$ = this.isLoadingSubject.asObservable();
	constructor( private playerService: PlayersService,
               private sorter: PlayersSorterByPipe,
               private toastr: ToastrService,
               private changeDetectorRef: ChangeDetectorRef ) {
	}


	ngOnInit() {
		this.playersState$ = this.playerService.players$()
		.pipe(
			map( response => {
				this.dataSubject.next( response );
				this.start();
				// console.log( "response - - - - > ", response );
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

  isAvailable( pickedPlayer: any ) {
    return !this.playersNotAvailable.find( busyPlayer => busyPlayer.id == pickedPlayer.id );
  }

	start() {
		if (this.dataSubject.value?.data) {
			let ongoingGames: Game[] = this.dataSubject.value?.data['ongoingGames'];
			let allPlayers: Player[] = this.dataSubject.value?.data['players'];
			Object.values( ongoingGames ).forEach( ( a ) => {
				a.team1.forEach( pl => this.playersNotAvailable.push( pl ) );
				a.team2.forEach( pl => this.playersNotAvailable.push( pl ) );
			} );
			Object.values( allPlayers ).forEach( ( p ) => {
				p.isAvailable = this.isAvailable( p );
			} );
		} else {
			console.log( "no data" );
		}
	}

  pickPlayer( player: Player ) {
    console.log(this._playersNextGame);
    if (this.isEditMode && player.isAvailable) {
      if (this._playersNextGame.includes( player )) {
        this._playersNextGame.splice( this._playersNextGame.indexOf( player ), 1 );
      } else {
        this._playersNextGame.push( player );
      }

      this.playersNextGameEmitter.emit( structuredClone(this._playersNextGame ));
    } else if (this.isEditMode && !player.isAvailable) {
      this.toastr.warning( `${ player.nickname } is playing`, "" );
    }
  }

  _unselectPlayersNextGame() {
    this._playersNextGame = [];
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    // this.playersState$.pipe()
  }

}

