import { Player } from "./Player";
import { GameFormat } from "../enums/GameFormat";
import { GameState } from "../enums/GameState";
import { Outcome } from "../enums/Outcome";

export interface Game {
	id: number,
	team1: Player[],
	team2: Player[],
  gameFormat: GameFormat,
	gameState?: GameState,
	createdAt?: Date,
	finishedAt?: Date,
	mvp?: Player,
	numberOfPlayers?: number,
	outcome?: Outcome
}