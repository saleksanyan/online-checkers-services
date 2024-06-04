import { IsOptional } from 'class-validator';
import Game from 'src/lib/Game';

export class UpdateGameDto {
  
	@IsOptional()
	gameToken?: string;

	@IsOptional()
	game?: Game;
}
