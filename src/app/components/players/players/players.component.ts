import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PlayersService } from "../../../services/players.service";
import { BehaviorSubject, catchError, map, Observable, of, startWith } from "rxjs";
import { AppState } from "../../../interfaces/AppState";
import { Player } from "../../../interfaces/Player";
import { DataState } from "../../../enums/DataState";
import { CustomHttpResponse } from "../../../interfaces/CustomHttpResponse";

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersComponent implements OnInit {

  playersState$ : Observable<AppState<CustomHttpResponse<Player>>>;
  protected readonly DataState = DataState;
  dataSubject = new BehaviorSubject<CustomHttpResponse<Player>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>( false );
  isLoading$ = this.isLoadingSubject.asObservable();


  constructor(private playerService: PlayersService) {
  }

  ngOnInit() {
    this.playersState$ = this.playerService.players$()
    .pipe(
      map( response => {
        this.dataSubject.next( response );
        console.log( "response - - - - > ", response);
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

}
