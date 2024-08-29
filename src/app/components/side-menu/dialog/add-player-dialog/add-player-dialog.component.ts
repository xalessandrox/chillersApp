import { Component, Inject, OnInit } from '@angular/core';
import { PlayersService } from "../../../../services/players.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector:'app-add-player-dialog',
  templateUrl:'./add-player-dialog.component.html',
  styleUrl:'./add-player-dialog.component.scss'
})
export class AddPlayerDialogComponent implements OnInit {

  nicknameFormControl = new FormControl('', [ Validators.required ]);
  pointsFormControl = new FormControl('500');
  form;

  constructor(private playersService: PlayersService, @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService) {
  }

  createPlayer() {
    if (!this.form.valid) {
      this.toastr.info("Required fields must be filled");
      return;
    }
    this.playersService.createPlayer$({ nickname:this.form.value.nickname, points:this.form.value.points })
    .subscribe({
      next:() => {
        this.data.dialogRef.close(true);
        this.toastr.success("", "Player created successfully");
      }, error:(err) => this.toastr.error("Error", `Something wrong happened: ${ err.message }`)
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({ 'nickname':this.nicknameFormControl, 'points':this.pointsFormControl });
  }

  get nickname() {
    return this.form.get('nickname');
  }

  get points() {
    return this.form.get('points');
  }

}
