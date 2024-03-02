import { Component, Input, OnInit } from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { GameService } from "../../../services/games.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";
import { DataState } from "../../../enums/DataState";
import { Player } from "../../../interfaces/Player";
import { Outcome } from "../../../enums/Outcome";

@Component( {
	selector : 'app-game',
	templateUrl : './game.component.html',
	styleUrl : './game.component.scss'
} )
export class GameComponent implements OnInit {

	@Input() game: Game;
	@Input() canBeSetFinished: boolean;

	gameState$: Observable<AppState<CustomHttpResponse<Game & Player[]>>>;
	dataSubject = new BehaviorSubject<CustomHttpResponse<Game & Player[]>>( null );
	protected readonly DataState = DataState;
	protected readonly Outcome = Outcome;
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	isLoading$ = this.isLoadingSubject.asObservable();

	constructor( private gamesService: GameService ) {
	}

	ngOnInit(): void {
		this.gameState$ = this.gamesService.game$( this.game.id )
		.pipe(
			map( response => {
				this.dataSubject.next( response );

				console.log( "Game & Player[] -*-*-*->>: ", response );
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
		);

	}

	// getPlayersOfThisGame() {
	// 	let team1: Player[] = this.dataSubject.value.data.team1;
	// 	let team2: Player[] = this.dataSubject.value.data.team2;
	// 	this.playersOfThisGame.emit( { team1, team2 } );
	//
	// }

}
