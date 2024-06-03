import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../entities/game.entity';
import { GameController } from '../controllers/game.controller';
import { GameService } from '../services/game.service';
import { BoardModule } from 'src/board/modules/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameEntity, BoardModule]),
    BoardModule
  ],
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {};
