import { Pipe, PipeTransform } from '@angular/core';
import { Player } from "../interfaces/Player";

@Pipe({
  name:'playersSorterBy',
  standalone:true
})
export class PlayersSorterByPipe implements PipeTransform {

  transform(value: Array<any>, ...sortBy: unknown[]): any[] {
    if (!value || !sortBy) {
      console.debug('No value or args found in PlayersSorterByPipe');
      return value;
    }
    switch (sortBy[0]) {
      case 'nickname':
        return this.sortByNickname(value);
      case 'playerPoints':
        return this.sortByPoints(value);
      case 'forNewGame':
        return this.forNewGame(value);
    }
    return value;
  }

  private sortByNickname(value: Player[]) {
    return value.sort((a: { nickname: string; }, b: { nickname: string; }) =>
      a.nickname.localeCompare(b.nickname));
  }

  private sortByPoints(value: Player []) {
    return value.sort((a, b) =>
      b.playerPoints - a.playerPoints
    );
  }

  private forNewGame(value: Player[]) {
    value = this.sortByPoints(value);
    switch (value.length) {
      case 4:
        return this.gameFor4(value);
      case 6:
        return this.gameFor6(value);
      case 8:
        return this.gameFor8(value);
      case 10:
        return this.gameFor10(value);
      default:
        return value;
    }
  }

  private gameFor10(value: Player[]) {
    return [
      value[0], value[3], value[4], value[7], value[8],
      value[1], value[2], value[5], value[6], value[9]
    ];
  }

  private gameFor8(value: Player[]) {
    return [
      value[0], value[3], value[4], value[7],
      value[1], value[2], value[5], value[6]
    ];
  }

  private gameFor6(value: Player[]) {
    return [ value[0], value[3], value[4], value[1], value[2], value[5] ];
  }

  private gameFor4(value: Player[]) {
    return [ value[0], value[3], value[1], value[2] ];
  }

}
