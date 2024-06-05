import {
	Entity,
	Column,
	PrimaryColumn,
	OneToOne,
	JoinColumn,
	Index,
	PrimaryGeneratedColumn,
	ValueTransformer,
} from 'typeorm';
import Game from 'src/lib/Game';

function reviveInstance<T>(cls: new (...args: any[]) => T, json: any): T {
	return Object.assign(new cls(), json);
}
const gameTransformer: ValueTransformer = {
	to: (game: Game) => JSON.stringify(game),
	from: (value: string) => reviveInstance(Game, JSON.parse(value))
};

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
