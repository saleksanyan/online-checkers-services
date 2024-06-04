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

const gameTransformer: ValueTransformer = {
	to: (game: Game) => JSON.stringify(game),
	from: (value: string) => JSON.parse(value) as Game,
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
