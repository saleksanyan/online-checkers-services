import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Color } from '../../lib/Constants';
import Queen from 'src/lib/Queen';
import Pawn from 'src/lib/Pawn';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  boardHistory: (Queen | Pawn | Color.EMPTY_PLACE)[][][] = [];

  @Column({ type: 'simple-json' })
  steps: { [move: string]: string }[] = [];
}
