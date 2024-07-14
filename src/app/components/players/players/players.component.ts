import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayersService } from "../../../services/players.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { Player } from "../../../interfaces/Player";
import { DataState } from "../../../enums/DataState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";
import { PlayersSorterByPipe } from "../../../pipes/players-sorter-by.pipe";
import { Game } from "../../../interfaces/Game";
import { ToastrService } from "ngx-toastr";
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'app-players',
    templateUrl: './players.component.html',
    styleUrl: './players.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PlayersSorterByPipe],
    standalone: true,
    imports: [NgIf, NgSwitch, NgSwitchCase, NgFor, NgStyle, NgClass, AsyncPipe, PlayersSorterByPipe]
})
export class PlayersComponent implements OnInit {
  @Output() pickedPlayers: EventEmitter<Player[]> = new EventEmitter<Player[]>
	@Output() switchEditMode: EventEmitter<boolean> = new EventEmitter<boolean>;
	// @Output() areTeamsMade: EventEmitter<boolean> = new EventEmitter<boolean>;
	@Input() isEditMode: boolean;
  @Output() pickedPlayer: EventEmitter<Player> = new EventEmitter<Player>;
	playersState$: Observable<AppState<CustomHttpResponse<Player>>>;
	dataSubject = new BehaviorSubject<CustomHttpResponse<Player[] & Game>>( null );
	protected readonly DataState = DataState;
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	isLoading$ = this.isLoadingSubject.asObservable();
  playersNextGame: Player[] = [];
  playersNotAvailable: Player[]	= [];
	constructor( private playerService: PlayersService, private sorter: PlayersSorterByPipe, private toastr: ToastrService ) {
	}


	ngOnInit() {
		this.playersState$ = this.playerService.players$()
		.pipe(
			map( response => {
				this.dataSubject.next( response );
				this.start();
				console.log( "response - - - - > ", response );
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

  isAvailable( player: any ) {
    return !this.playersNotAvailable.find( pl => pl.id == player.id );
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
    if (this.isEditMode && player.isAvailable) {
      if (this.playersNextGame.includes( player )) {
        this.playersNextGame.splice( this.playersNextGame.indexOf( player ), 1 );
      } else {
        this.playersNextGame.push( player );
      }

      this.pickedPlayer.emit( player );
    } else if (this.isEditMode && !player.isAvailable) {
      this.toastr.warning( `${ player.nickname } is playing`, "" );
    }
  }
}

