import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Color } from '../../lib/Constants';
import Figure from '../../lib//Figure';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  boardHistory: (Figure | Color.EMPTY_PLACE)[][][] = [];

  @Column({ type: 'simple-json' })
  steps: { [move: string]: string }[] = [];
}
