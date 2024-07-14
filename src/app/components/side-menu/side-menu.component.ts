import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from "../../interfaces/Game";
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrl: './side-menu.component.scss',
    standalone: true,
    imports: [NgStyle]
})
export class SideMenuComponent {

	@Output() switchEditMode: EventEmitter<boolean> = new EventEmitter<boolean>;
	@Input() isEditMode: boolean;

	game: Game = { id : null, gameFormat : null, team1 : null, team2 : null };

	switchIsEditMode() {
		this.isEditMode = !this.isEditMode;
		this.switchEditMode.emit( this.isEditMode );
	}

}
