import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import Board from '../../board/entities/board.entity';
import Position from '../../lib/Position';
import Move from '../../lib/Move';
import Pawn from 'src/lib/Pawn';
import Queen from 'src/lib/Queen';


@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Board, { cascade: true })
  @JoinColumn()
  board: Board;

  @Column({ nullable: true, type: 'simple-json' })
  currentFigure: Pawn | Queen | null;

  @Column({ nullable: true, type: 'simple-array' })
  reachablePositionsOfCurrentFigure: Position[] | null;

  @Column({ type: 'simple-array' })
  moves: Move[] = [];
}