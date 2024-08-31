import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from "../../interfaces/Game";
import { NgIf, NgStyle } from '@angular/common';
import { GameDialogComponent } from "../modals/game-dialog/game-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AddPlayerDialogComponent } from "./dialog/add-player-dialog/add-player-dialog.component";

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrl: './side-menu.component.scss',
    standalone: true,
  imports:[ NgStyle, NgIf ]
})
export class SideMenuComponent {

	@Input() isEditMode: boolean;
	@Output() switchEditMode: EventEmitter<boolean> = new EventEmitter<boolean>;
  @Output() refreshPlayers: EventEmitter<void> = new EventEmitter<void>();


  constructor(private dialog: MatDialog, private toastrService: ToastrService) {
  }

	switchIsEditMode() {
		this.isEditMode = !this.isEditMode;
		this.switchEditMode.emit( this.isEditMode );
	}

  onAddPlayer() {
    const dialogRef = this.dialog.open(AddPlayerDialogComponent, {
      data : { dialogRef: undefined }
    });
    dialogRef._containerInstance._config.data.dialogRef = dialogRef;
    dialogRef.beforeClosed().subscribe({
      next: (result) => {
        if(result) {
          this.refreshPlayers.emit();
        } else {
          this.toastrService.clear();
        }
      },
      error: err => {
        console.log( "ERR", err );
      }
    });
  }

}
