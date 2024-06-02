import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import Board from '../../board/entities/board.entity';
import Figure from '../../lib/Figure';
import Position from '../../lib/Position';
import Move from '../../lib/Move';


@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Board, { cascade: true })
  @JoinColumn()
  board: Board;

  @Column({ nullable: true, type: 'simple-json' })
  currentFigure: Figure | null;

  @Column({ nullable: true, type: 'simple-array' })
  reachablePositionsOfCurrentFigure: Position[] | null;

  @Column({ type: 'simple-array' })
  moves: Move[] = [];
}