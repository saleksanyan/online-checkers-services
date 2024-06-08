import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';


@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string =  uuidv4();;

  @Column({ nullable: false })
  gameID: string;

  @Column({ nullable: false })
  jwtPlayer: string;
}


