import { IsNotEmpty } from 'class-validator';
import { BoardEntity } from '../../board/entities/board.entity';

export class CreateGameDto {
  @IsNotEmpty()
  gameToken: string;

  @IsNotEmpty()
  board: BoardEntity;
}