import { Pipe, PipeTransform } from '@angular/core';
import { Game } from "../interfaces/Game";

@Pipe({
    name: 'gamesSorterBy',
    standalone: true
})
export class GamesSorterByPipe implements PipeTransform {

	transform(value: Array<Game>, ...args: unknown[]):  any[] {
		if(!value) {
			return value;
		}
		let sortBy = args[0];
		switch (sortBy) {
			case 'createdAtDesc': return this.sortByBegin(value);
		}
		return value;
	}

	private sortByBegin(value) {
    return value.sort( ( a: { createdAt: string; }, b: { createdAt: string; } ) =>
			b.createdAt.localeCompare( a.createdAt ) );
	}

}
