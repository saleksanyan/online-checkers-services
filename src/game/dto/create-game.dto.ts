import { IsNotEmpty, IsOptional } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import Game from '../../lib/Game';

export class CreateGameDto {
	@IsNotEmpty()
	id: string = uuidv4();

	@IsOptional()
	game?: Game;

	@IsOptional()
  	players: string[];
}
