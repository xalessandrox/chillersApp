import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlayersService } from "../../../services/players.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { Player } from "../../../interfaces/Player";
import { DataState } from "../../../enums/DataState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";
import { PlayersSorterByPipe } from "../../../pipes/players-sorter-by.pipe";

@Component( {
	selector : 'app-players',
	templateUrl : './players.component.html',
	styleUrl : './players.component.scss',
	changeDetection : ChangeDetectionStrategy.OnPush,
	providers: [PlayersSorterByPipe]
} )
export class PlayersComponent implements OnInit {
	@Output() pickedPlayers: EventEmitter<Player[]> = new EventEmitter<Player[]>;
	@Output() switchEditMode: EventEmitter<boolean> = new EventEmitter<boolean>;
	@Input() isEditMode: boolean;
	players: Player[] = [];

	playersState$: Observable<AppState<CustomHttpResponse<Player>>>;
	dataSubject = new BehaviorSubject<CustomHttpResponse<Player>>( null );
	protected readonly DataState = DataState;
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	isLoading$ = this.isLoadingSubject.asObservable();


	constructor( private playerService: PlayersService, private sorter: PlayersSorterByPipe ) {
	}

	ngOnInit() {
		this.playersState$ = this.playerService.players$()
		.pipe(
			map( response => {
				this.dataSubject.next( response );
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

	pickPlayer( player: Player ) {
		if (this.isEditMode) {
			if(this.players.includes(player)) {
				this.players.splice( this.players.indexOf(player), 1 );
			} else {
				this.players.push( player );
			}
			this.makeTeams();
			this.pickedPlayers.emit( this.players );
		}
	}


	private makeTeams() {
		this.players = this.sorter.transform( this.players, 'nickname' );
	}
}
