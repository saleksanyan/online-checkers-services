import { Entity, Column, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import Game from 'src/lib/Game';
import { v4 as uuidv4 } from 'uuid';

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
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({ type: 'json', transformer: gameTransformer })
  game: Game;

  @Column({ type: 'simple-array' })
  players: string[];
}

