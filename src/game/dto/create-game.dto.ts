import { IsNotEmpty } from 'class-validator';
import { Board } from '../../board/entities/board.entity';

export class CreateGameDto {
  @IsNotEmpty()
  gameToken: string;

  @IsNotEmpty()
  board: Board;
}