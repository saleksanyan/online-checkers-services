import Board from 'src/lib/Board';
import History from 'src/lib/History';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
  } from 'typeorm';

@Entity()
export class BoardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  board: Board;

  @Column({ type: 'json' })
  history: History;
}

export default BoardEntity;