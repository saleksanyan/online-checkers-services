import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, Index } from 'typeorm';
import Board from '../../board/entities/board.entity';
import Position from '../../lib/Position';
import Move from '../../lib/Move';
import Pawn from 'src/lib/Pawn';
import Queen from 'src/lib/Queen';


@Entity()
export class Game {
  @PrimaryColumn()
  id: number;

  @Column({nullable: false})
  @Index({unique: true})
  gameToken: string;

  @OneToOne(() => Board, { cascade: true })
  @JoinColumn()
  board: Board;

  @Column({ nullable: true, type: 'json' })
  currentFigure: Pawn | Queen | null;

  @Column({ nullable: true, type: 'simple-array' })
  reachablePositionsOfCurrentFigure: Position[] | null;

  @Column({ type: 'simple-array' })
  moves: Move[] = [];

}