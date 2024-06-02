import { Module } from '@nestjs/common';
import { AppController } from './game/controllers/game.controller';
import { AppService } from './game/services/game.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/modules/game.module';
import { BoardModule } from './board/modules/board.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'local'}`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'checkersdb',
      entities: ['dist/**/*.entity.ts'],
      username: 'postgres',
      password: 'postgres1234',
      synchronize: true
    }),
    GameModule,
    BoardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
