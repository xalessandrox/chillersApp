import { Outcome } from "../../enums/Outcome";

export interface GameDto {

	id: number,
	outcome: Outcome,
	mvp: {
		id: number
	}

}