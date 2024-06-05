import {
	Entity,
	Column,
	Index,
	PrimaryGeneratedColumn,
	ValueTransformer,
} from 'typeorm';
import Game from 'src/lib/Game';
import Board from 'src/lib/Board';
import History from 'src/lib/History';
import { Color, FigureType } from 'src/lib/Constants';
import Figure from 'src/lib/Figure';
import Pawn from 'src/lib/Pawn';
import Queen from 'src/lib/Queen';

function reviveInstance<T>(cls: new (...args: any[]) => T, json: any): T {
	return Object.assign(new cls(), json);
}
const gameTransformer: ValueTransformer = {
    to: (game: Game) => serializeGame(game),
    from: (value: string) => deserializeGame(value),
};

export default gameTransformer;

function serializeGame(game: Game): string {
    return JSON.stringify(game.toJSON());
}

function deserializeGame(json: string): Game {
    const parsedObj = JSON.parse(json);
    return Game.fromJSON(parsedObj);
}


@Entity()
export class GameEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	@Index({ unique: true })
	gameToken: string;

	@Column({ type: 'json', transformer: gameTransformer })
	game: Game;
}


