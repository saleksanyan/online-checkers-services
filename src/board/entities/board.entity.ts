import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
  } from 'typeorm';
import Figure from "../../lib/Checkers_library/src/Figure";
import { Color } from "../../lib/Checkers_library/src/Constants";
import { History } from 'src/history/entities/history.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  matrix: (Figure | Color.EMPTY_PLACE)[][];

  @Column()
  blackCounter: number;

  @Column()
  whiteCounter: number;

  @OneToOne(() => History, { cascade: true })
  @JoinColumn()
  history: History;

  @Column()
  whosTurn: Color.BLACK | Color.WHITE;

}

export default Board;  