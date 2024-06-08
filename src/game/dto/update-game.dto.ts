import { IsNotEmpty, IsOptional } from 'class-validator';
import Game from 'src/lib/Game';
import { v4 as uuidv4 } from 'uuid';

export class UpdateGameDto {
	@IsNotEmpty()
	id: string = uuidv4();

	@IsOptional()
	game?: Game;

	@IsOptional()
	players: string[];
}
