import { Module } from '@nestjs/common';
import { GameController } from './game/controllers/game.controller';
import { GameService } from './game/services/game.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/modules/game.module';
import { BoardModule } from './board/modules/board.module';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { GameEntity } from './game/entities/game.entity';
import BoardEntity from './board/entities/board.entity';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forFeature([GameEntity, BoardEntity]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        join(__dirname, './**/**/*.entity{.ts,.js}'), // Main entities directory
        join(__dirname, './board/entities/**/*{.ts,.js}'), // Board entities directory
        join(__dirname, './game/entities/**/*{.ts,.js}'), // Game entities directory
      ],
      synchronize: true,
      logging: true,
    }),
    GameModule,
    BoardModule,
  ],
  controllers: [GameController],
  providers: [GameService],
})
export class AppModule {}