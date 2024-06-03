// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import BoardEntity from './board/entities/board.entity';
import Board from './lib/Board';
import { GameService } from './game/services/game.service';
import { randomUUID } from 'crypto';

async function bootstrap() {  
    const boardEntity = new BoardEntity();
    const board = new Board();

    boardEntity.board = board;
    
  const app = await NestFactory.create(AppModule);

  const gameService = app.get(GameService)
  gameService.create(randomUUID(), boardEntity)

  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();