import { Component, Inject, OnInit } from '@angular/core';
import { Game } from "../../../../interfaces/Game";
import { Outcome } from "../../../../enums/Outcome";
import { Player } from "../../../../interfaces/Player";
import { GameService } from "../../../../services/games.service";
import { ToastrService } from "ngx-toastr";
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";

@Component( {
  selector : 'app-dialog',
  templateUrl : './game-dialog.component.html',
  styleUrl : './game-dialog.component.scss',
  standalone : true,
  imports:[ NgIf, NgFor, FormsModule, JsonPipe, MatDialogContent, MatDialogTitle, MatDialogActions, MatDialogClose, NgClass ]
} )
export class GameDialogComponent implements OnInit {
  game: Game;
  outcome: Outcome;
  protected readonly Outcome = Outcome;

  constructor( private gameService: GameService, private toastr: ToastrService,  @Inject(MAT_DIALOG_DATA) public data: any,  ) {
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

  saveGame(  ) {
    if (!this.game.mvp && !(this.outcome == Outcome.Scrap)) {
      this.toastr.info( "Pick the best player of this game", "MVP required" );
    } else {
      if (confirm( "Please confirm again your choice\nDo you want to save this game?" )) {
        this.game.outcome = this.outcome;
        this.gameService.saveGame$( this.game ).subscribe( {
          next : () => {
            this.data.dialogRef.close(true);
            this.toastr.success( "", "Game saved successfully" );
          },
          error : ( err ) => this.toastr.error( "Error", `Something wrong happened: ${ err.message }` )
        } );
      }
    }
  }

  ngOnInit(): void {
    this.game = this.data.game;
    this.outcome = this.data.outcome;

  }

}
