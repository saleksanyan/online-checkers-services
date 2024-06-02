import { Module } from '@nestjs/common';
import { AppController } from './game/controllers/game.controller';
import { AppService } from './game/services/game.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/modules/game.module';
import { BoardModule } from './board/modules/board.module';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        join(__dirname, './**/**/*.entity{.ts,.js}'), 
        join(__dirname, './board/entities/**/*{.ts,.js}'), 
        join(__dirname, './history/entities/**/*{.ts,.js}'), 
      ],
      synchronize: true,
      logging: true,
    }),
    GameModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}