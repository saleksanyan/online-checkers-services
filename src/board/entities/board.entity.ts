import Board from 'src/lib/Board';
import History from 'src/lib/History';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

const boardTransformer: ValueTransformer = {
  to: (board: Board) => JSON.stringify(board),
  from: (value: string) => JSON.parse(value) as Board,
};

@Entity()
export class BoardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json', transformer: boardTransformer })
  board: Board;
}

export default BoardEntity;
