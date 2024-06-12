
// import { NestFactory } from '@nestjs/core';
// import * as dotenv from 'dotenv'
// import { AppModule } from './app.module';

// dotenv.config();

// async function bootstrap() {
// 	const app = await NestFactory.create(AppModule);
// 	await app.listen(process.env.APP_PORT);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import Board from './lib/Board';
import { GameService } from './game/services/game.service';
import { randomUUID } from 'crypto';
import { CreateGameDto } from './game/dto/create-game.dto';

dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('API')
		.setDescription('API description')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
			'JWT',
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	app.enableCors();
	await app.listen(process.env.APP_PORT);
}
bootstrap();
