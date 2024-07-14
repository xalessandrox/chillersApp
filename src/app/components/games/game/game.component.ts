import { Component, Input, OnInit } from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { GameService } from "../../../services/games.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";
import { DataState } from "../../../enums/DataState";
import { Player } from "../../../interfaces/Player";
import { Outcome } from "../../../enums/Outcome";
import { ToastrService } from "ngx-toastr";
import { GameModalComponent } from '../../modals/game-modal/game-modal.component';
import { AsyncPipe, NgClass, NgFor, NgIf, NgStyle, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss',
    standalone: true,
    imports: [NgIf, NgSwitch, NgSwitchCase, NgClass, NgStyle, NgFor, GameModalComponent, AsyncPipe]
})
export class GameComponent implements OnInit {

	@Input() game: Game;
	@Input() canBeSetFinished: boolean;

	gameState$: Observable<AppState<CustomHttpResponse<Game & Player[]>>>;
	dataSubject = new BehaviorSubject<CustomHttpResponse<Game & Player[]>>( null );
	protected readonly DataState = DataState;
	protected readonly Outcome = Outcome;
	private isLoadingSubject = new BehaviorSubject<boolean>( false );
	isLoading$ = this.isLoadingSubject.asObservable();
	openModal: boolean = false;
	constructor( private gameService: GameService, private toastr: ToastrService ) {
	}

	ngOnInit(): void {

		if(this.game.id) {

			this.gameState$ = this.gameService.game$( this.game.id )
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


	}




}
