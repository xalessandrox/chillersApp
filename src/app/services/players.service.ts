import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Player } from "../interfaces/Player";
import { environment } from "../../environments/environment.development";
import { CustomHttpResponse } from "../interfaces/CustomHttpResponse";
import { Game } from "../interfaces/Game";

@Injectable( {
	providedIn : 'root'
} )
export class PlayersService {

	constructor( private httpClient: HttpClient ) {
	}


	players$ = () => <Observable<CustomHttpResponse<Player[] & Game>>>
		this.httpClient.get<CustomHttpResponse<Player>>
		( `${ environment.baseUrl }:${ environment.serverPort }/players/all` )
		.pipe(
			tap( () => console.log() ),
			catchError( this.handleError )
		)

	private handleError( response: HttpErrorResponse ): Observable<never> {
		console.log( response );
		let errorMessage: string;
		if (response.error instanceof ErrorEvent) {
			errorMessage = `A client error occurred - ${ response.error.message }`;
		} else {
			if (response.error.reason) {
				errorMessage = response.error.reason;
				console.log( errorMessage );
			} else {
				errorMessage = `An error occurred - Error status ${ response.status }`;
			}
		}
		return throwError( () => errorMessage );
	}

}
