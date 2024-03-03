import { Component, Input, OnInit } from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { Outcome } from "../../../enums/Outcome";
import { Player } from "../../../interfaces/Player";
import { GameService } from "../../../services/games.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-game-modal',
  templateUrl: './game-modal.component.html',
  styleUrl: './game-modal.component.scss'
})
export class GameModalComponent implements OnInit{
  @Input() game: Game;

  protected readonly Outcome = Outcome;

  constructor(private gameService: GameService, private toastr: ToastrService) {
  }

  getPlayersFromTeam1( game: Game ): Player[] {
    return [ ...game.team1 ];
  }

  getPlayersFromTeam2( game: Game ): Player[] {
    return [ ...game.team2 ];
  }

  resetGameValues( game: Game ) {
    delete game.outcome;
    delete game.mvp;
    this.toastr.clear();
  }
  saveGame( game: Game ) {
    if (!game.mvp) {
      this.toastr.info("Pick the best player of this game", "MVP required");
    } else {
      if (confirm( "Please confirm again your choice\nDo you want to save this game?" )) {
        window.location.reload();
        this.gameService.saveGame$( game ).subscribe();
        window.setTimeout(() => {
          this.toastr.success("", "Game saved successfully");

        }, 0);
      }
    }

    // let gameDto:GameDto = {"id": game.id, "outcome": game.outcome, "mvp": {"id": game.mvp?.id} };
    // console.log("saving game", gameDto);

  }

  ngOnInit(): void {



  }

}
