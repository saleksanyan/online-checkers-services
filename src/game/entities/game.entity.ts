import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import Board from '../../board/entities/board.entity';
import Figure from '../../lib/Checkers_library/Figure';
import Position from '../../lib/Checkers_library/Position';
import Move from '../../lib/Checkers_library/Move';


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