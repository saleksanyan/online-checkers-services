import { Exclude } from 'class-transformer';
import { GameEntity } from 'src/game/entities/game.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class PlayerEntity {
	@PrimaryGeneratedColumn('uuid')
	@Exclude()
	id: string = uuidv4();

	@ManyToOne(() => GameEntity, (game) => game.id)
	gameID: string;

	@Column({ nullable: false })
	jwtPlayer: string;
}
