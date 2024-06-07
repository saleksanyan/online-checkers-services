import { Module } from '@nestjs/common';
import { GameController } from './game/controllers/game.controller';
import { GameService } from './game/services/game.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/modules/game.module';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { GameEntity } from './game/entities/game.entity';
import { PlayerEntity } from './player/entities/player.entity';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

dotenv.config();

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env`,
		}),
		TypeOrmModule.forFeature([GameEntity, PlayerEntity]),
		JwtModule.register({
			secret: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '1h' },
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT || '5432'),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [
				join(__dirname, './**/**/*.entity{.ts,.js}'), 
				join(__dirname, './game/entities/**/*{.ts,.js}'),
				join(__dirname, './player/entities/**/*{.ts,.js}'),
			],
			synchronize: true,
			logging: true,
		}),
		GameModule,
		AuthModule,
	],
	controllers: [GameController],
	providers: [GameService],
})
export class AppModule {}
