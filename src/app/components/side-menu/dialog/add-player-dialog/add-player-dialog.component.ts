import { Component, Inject } from '@angular/core';
import { PlayersService } from "../../../../services/players.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

@Component({
  selector:'app-add-player-dialog',
  templateUrl:'./add-player-dialog.component.html',
  styleUrl:'./add-player-dialog.component.scss'
})
export class AddPlayerDialogComponent {
  constructor(private playersService: PlayersService, @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService) {
  }

  createPlayer(nickname, points) {
    this.playersService.createPlayer$({ nickname:nickname.value, points:points.value })
    .subscribe({
      next:() => {
        this.data.dialogRef.close(true);
        this.toastr.success("", "Player created successfully");
      }, error:(err) => this.toastr.error("Error", `Something wrong happened: ${ err.message }`)
    });
  }
}
