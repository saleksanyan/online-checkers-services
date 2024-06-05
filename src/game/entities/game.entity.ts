import {
	Entity,
	Column,
	Index,
	PrimaryGeneratedColumn,
	ValueTransformer,
} from 'typeorm';
import Game from 'src/lib/Game';

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


