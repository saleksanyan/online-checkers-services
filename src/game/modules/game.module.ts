import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt'; // Import JwtModule
import { GameEntity } from '../entities/game.entity';
import { GameController } from '../controllers/game.controller';
import { GameService } from '../services/game.service';
import { JwtMiddleware } from '../../helper/jwt.middleware';
import { PlayerEntity } from '../../player/entities/player.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([GameEntity, PlayerEntity]),
		JwtModule.register({
			secret: process.env.JWT_SECRET_KEY,
			signOptions: { expiresIn: '24h' },
		}),
	],
	controllers: [GameController],
	providers: [GameService, JwtService],
	exports: [JwtService, TypeOrmModule],
})
export class GameModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(JwtMiddleware)
    .exclude(
			{ path: 'games/newGame', method: RequestMethod.POST },
      { path: 'games/addSecondPlayer/:gameID', method: RequestMethod.POST },
      { path: 'games/:gameID', method: RequestMethod.GET } 
		  )
    .forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
