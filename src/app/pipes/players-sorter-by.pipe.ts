import { Pipe, PipeTransform } from '@angular/core';
import { Player } from "../interfaces/Player";

@Pipe({
	name: 'playersSorterBy'
})
export class PlayersSorterByPipe implements PipeTransform {

	transform(value: Array<Player>, ...args: unknown[]):  any[] {
		if(!value) {
			return value;
		}
		let sortBy = args[0];
		switch (sortBy) {
			case 'nickname': return this.sortByNickname(value);
			case 'playerPoints': return this.sortByPoints(value);
		}

		return value;
	}

	private sortByNickname(value: { nickname: string; }[]) {
		return value.sort( ( a: { nickname: string; }, b: { nickname: string; } ) =>
			a.nickname.localeCompare( b.nickname ) );
	}

	private sortByPoints(value: {playerPoints: number}[]) {
		return value.sort((a, b) =>
			b.playerPoints - a.playerPoints
		);
	}

}