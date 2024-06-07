import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt'; // Import JwtModule
import { GameEntity } from '../entities/game.entity';
import { GameController } from '../controllers/game.controller';
import { GameService } from '../services/game.service';
import { JwtMiddleware } from 'src/helper/jwt.middleware';
import { PlayerEntity } from 'src/player/entities/player.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([GameEntity, PlayerEntity]),
		JwtModule.register({
			secret: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '1h' },
		}),
	],
	controllers: [GameController],
	providers: [GameService, JwtService, AuthService],
	exports: [JwtService],
})
export class GameModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(JwtMiddleware)
    .exclude(
			{ path: 'games/NewGame', method: RequestMethod.GET },
		  )
    .forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
