import { Component, Input, OnInit } from '@angular/core';
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


@Component( {
	selector : 'app-games',
	templateUrl : './games.component.html',
	styleUrl : './games.component.scss'
} )

export class GamesComponent implements OnInit {
	@Input() isEditMode: boolean;
	gamesState$: Observable<AppState<CustomHttpResponse<Game>>>;
	dataSubject = new BehaviorSubject<CustomHttpResponse<Game>>( null );
	playersOfGame: Player[] = [];
	isReadyToSave: boolean = false;
	protected readonly DataState = DataState;
	protected readonly Outcome = Outcome;
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	isLoading$ = this.isLoadingSubject.asObservable();

	constructor( private gameService: GameService, private toastr: ToastrService ) {
	}

	ngOnInit(): void {
		this.gamesState$ = this.gameService.games$()
		.pipe(
			map( response => {
				this.dataSubject.next( response );
				console.log( "Games: ", response );
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


	getGameFormat( value: string ): string {
		let res = Object
		.values( GameFormat )
		.filter( ( val ) => val.localeCompare( value ) );
		return res[0];
	}

	showRow( index: number, $event, gameState ) {
		if (gameState == 'STARTED') return;
		let classToToggle = `content${ index }`;
		let elementToToggle = document.querySelector( `.${ classToToggle }` );
		elementToToggle.classList.toggle( 'hide' );

		// let elements = document.querySelectorAll( `.acc-item` );
		// elements.forEach( ( e ) => {
		// 	if (!e.classList.contains( classToToggle ) && !e.classList.contains( 'hide' )) {
		// 		e.classList.add( 'hide' );
		// 	}
		// } );
	}

}
