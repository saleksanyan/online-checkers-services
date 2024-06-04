import { IsNotEmpty } from 'class-validator';
import Game from 'src/lib/Game';

export class CreateGameDto {
	@IsNotEmpty()
	gameToken: string;

	game?: Game;
}
