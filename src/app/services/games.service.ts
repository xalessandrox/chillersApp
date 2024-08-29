import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { CustomHttpResponse } from "../interfaces/CustomHttpResponse";
import { environment } from "../../environments/environment.development";
import { Game } from "../interfaces/Game";
import { Player } from "../interfaces/Player";

@Injectable({
  providedIn:'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) {
  }

  games$ = () => <Observable<CustomHttpResponse<Game>>>
    this.httpClient.get<CustomHttpResponse<Game>>
    (`${ environment.baseUrl }:${ environment.serverPort }/games/all`).pipe(catchError(this.handleError))

  game$ = (gameId: number) => <Observable<CustomHttpResponse<Game & Player[]>>>
    this.httpClient.get<CustomHttpResponse<Game & Player[]>>
    (`${ environment.baseUrl }:${ environment.serverPort }/games/${ gameId }`).pipe(catchError(this.handleError))

  createGame$ = (game: Game) => <Observable<CustomHttpResponse<Game>>>
    this.httpClient.post<CustomHttpResponse<Game>>
    (`${ environment.baseUrl }:${ environment.serverPort }/games/new`, game).pipe(catchError(this.handleError));

  saveGame$ = (game: Game) => <Observable<CustomHttpResponse<Game>>>
    this.httpClient.patch<CustomHttpResponse<Game>>
    (`${ environment.baseUrl }:${ environment.serverPort }/games/save`, game).pipe(catchError(this.handleError));

  private handleError(response: HttpErrorResponse): Observable<never> {
    console.log(response);
    let errorMessage: string;
    if (response.error instanceof ErrorEvent) {
      errorMessage = `A client error occurred - ${ response.error.message }`;
    } else {
      if (response.error.reason) {
        errorMessage = response.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `An error occurred - Error status ${ response.status }`;
      }
    }
    return throwError(() => errorMessage);
  }

}
