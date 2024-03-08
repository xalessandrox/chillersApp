import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from "../../interfaces/Game";

@Component( {
	selector : 'app-side-menu',
	templateUrl : './side-menu.component.html',
	styleUrl : './side-menu.component.scss'
} )
export class SideMenuComponent {

	@Output() switchEditMode: EventEmitter<boolean> = new EventEmitter<boolean>;
	@Input() isEditMode: boolean;

	game: Game = { id : null, gameFormat : null, team1 : null, team2 : null };

	switchIsEditMode() {
		this.isEditMode = !this.isEditMode;
		this.switchEditMode.emit( this.isEditMode );
	}

}
