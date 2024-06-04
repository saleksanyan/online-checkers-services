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
import Board from './lib/Board';
import { GameService } from './game/services/game.service';
import { randomUUID } from 'crypto';
import { CreateGameDto } from './game/dto/create-game.dto';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// const gameService = app.get(GameService);
	// const gameDto = new CreateGameDto();
	// gameDto.gameToken = randomUUID();
	// gameService.create(gameDto);

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
