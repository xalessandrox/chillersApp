import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter, inject,
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
  selector:'app-players',
  templateUrl:'./players.component.html',
  styleUrl:'./players.component.scss',
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[ PlayersSorterByPipe ],
  standalone:true,
  imports:[ NgIf, NgSwitch, NgSwitchCase, NgFor, NgStyle, NgClass, AsyncPipe, PlayersSorterByPipe, JsonPipe ]
})
export class PlayersComponent implements OnInit {

  playersState$: Observable<AppState<CustomHttpResponse<Player>>>;
  dataSubject = new BehaviorSubject<CustomHttpResponse<Player[] & Game>>(null);
  playersNotAvailable: Player[] = [];
  playersOfNextGame: Player[] = [];
  @Input() isEditMode: boolean;
  @Input() playersNextGameReset!: Player[];
  @Input() playersNextGameInput: Player[] = [];
  @Output() playersNextGameOutput: EventEmitter<Player[]> = new EventEmitter<Player[]>;
  @Output() switchEditMode: EventEmitter<boolean> = new EventEmitter<boolean>;
  changeDetectorRef = inject(ChangeDetectorRef);
  protected readonly DataState = DataState;
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private playerService: PlayersService,
    private sorter: PlayersSorterByPipe,
    private toastr: ToastrService) {

  }

  ngOnInit() {
    this.loadData();
  }

  get playersNextGame() {
    return this.playersOfNextGame;
  }

  set playersNextGame(players: Player[]) {
    this.playersOfNextGame = players;
  }

  loadData() {
    this.playersState$ = this.playerService.players$()
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        this.playersNextGame = [];
        this.filterAvailablePlayers();
        return {
          dataState:DataState.Loaded,
          appData:response
        };
      }),
      startWith({ dataState:DataState.Loading }),
      catchError((error: string) => {
        return of({
          dataState:DataState.Error,
          error
        })
      })
    )
  }

  isAvailable(pickedPlayer: any) {
    return !this.playersNotAvailable.find(busyPlayer => busyPlayer.id == pickedPlayer.id);
  }

  filterAvailablePlayers() {
    this.playersNotAvailable = [];
    if (this.dataSubject.value?.data) {
      let ongoingGames: Game[] = this.dataSubject.value?.data['ongoingGames'];
      let allPlayers: Player[] = this.dataSubject.value?.data['players'];
      // Fetches players from all ongoing games
      Object.values(ongoingGames).forEach((a) => {
        a.team1.forEach(pl => this.playersNotAvailable.push(pl));
        a.team2.forEach(pl => this.playersNotAvailable.push(pl));
      });
      // Assigns available value by comparing
      Object.values(allPlayers).forEach((p) => {
        p.isAvailable = this.isAvailable(p);
      });
    } else {
      this.toastr.error("Could not fetch players");
    }
  }

  pickPlayer(player: Player) {
    if(!this.isEditMode) return;
    if (player.isAvailable) {
      if (this.playersNextGame.includes(player)) {
        this.playersNextGame.splice(this.playersNextGame.indexOf(player), 1);
      } else {
        this.playersNextGame.push(player);
      }
      this.playersNextGameOutput.emit(structuredClone(this.playersNextGame));
    } else {
      this.toastr.warning(`${ player.nickname } is playing`, "");
    }
  }

  _unselectPlayersNextGame() {
    this.playersNextGameInput = [];
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    // this.playersState$.pipe()
  }

}

