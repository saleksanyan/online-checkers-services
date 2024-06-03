import { IsOptional } from 'class-validator';
import { Board } from '../../board/entities/board.entity';
import Pawn from 'src/lib/Pawn';
import Queen from 'src/lib/Queen';
import Position from 'src/lib/Position';
import Move from 'src/lib/Move';

export class UpdateGameDto {
  @IsOptional()
  gameToken?: string;

  @IsOptional()
  board?: Board;

  @IsOptional()
  currentFigure?: Pawn | Queen | null;

  @IsOptional()
  reachablePositionsOfCurrentFigure?: Position[] | null;

  @IsOptional()
  moves?: Move[];
}