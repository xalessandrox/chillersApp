import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Game } from "../../../interfaces/Game";
import { Player } from "../../../interfaces/Player";
import { GameFormat } from "../../../enums/GameFormat";

@Component( {
	selector : 'app-new-game',
	templateUrl : './new-game.component.html',
	styleUrl : './new-game.component.scss'
} )
export class NewGameComponent  implements OnChanges{
	@Input() isEditMode!: boolean;
	@Input() players!: Player[];
	game: Game = { "id": null, team1: null, team2: null, mvp: null, gameFormat: null};

	ngOnChanges( changes: SimpleChanges | any ): void {
	// 	console.log( "changes", changes?.player );
	// 	let player : Player = changes.player.currentValue;
	// 	if(this.players.has(player)) {
	// 		console.log("has it")
	// 		this.players.delete( player );
	// 	} else {
	// 		console.log("doesn't")
	// 	this.players.add( player );
	// 	}
	}

	protected readonly GameFormat = GameFormat;
}
