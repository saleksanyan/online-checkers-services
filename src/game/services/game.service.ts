import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/helper/statuses';
import { RESPONSE_MESSAGES } from 'src/helper/respose-messages';
import { CustomResponse } from 'src/helper/customResponse';
import { CreateGameDto } from '../dto/create-game.dto';
import Game from 'src/lib/Game';
import { HashingService } from 'src/helper/hashingService';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameEntity)
		private readonly gameRepository: Repository<GameEntity>,
	) {}

	async create(
		createGameDto: CreateGameDto,
	): Promise<CustomResponse<GameEntity>> {
    //hashing
    const initalGameToken = createGameDto.gameToken;
    const hashedGameToken = HashingService.hashData(initalGameToken);
    createGameDto.gameToken = hashedGameToken;

		const existingGame = await this.gameRepository.findOne({
			where: { gameToken: createGameDto.gameToken },
		});

		if (existingGame) {
			return new CustomResponse<GameEntity>(
				SUCCESS_MESSAGE,
				existingGame,
				null,
				RESPONSE_MESSAGES.GAME_EXISTS,
			);
		}
		createGameDto.game = new Game();
		const newGame = this.gameRepository.create(createGameDto);
		try {
			await this.gameRepository.save(newGame);

			return new CustomResponse<GameEntity>(
				SUCCESS_MESSAGE,
				newGame,
				RESPONSE_MESSAGES.CREATE_GAME_SUCCESS,
			);
		} catch (error) {
			console.error('Error creating GameEntity:', error);
			return new CustomResponse<GameEntity>(
				ERROR_MESSAGE,
				error.message,
				RESPONSE_MESSAGES.CREATE_GAME_FAIL,
				error.status,
			);
		}
	}

	async findAll(): Promise<GameEntity[]> {
		return this.gameRepository.find();
	}

	async findOne(gameToken: string): Promise<GameEntity> {
    
    const hashedGameToken = HashingService.hashData(gameToken);
		const options: FindOneOptions<GameEntity> = {
			where: { gameToken: hashedGameToken }
		};
		return this.gameRepository.findOne(options);
	}

	async update(updateGameDto: Partial<GameEntity>): Promise<GameEntity> {
    const initalGameToken = updateGameDto.gameToken;
    const hashedGameToken = HashingService.hashData(initalGameToken);
    updateGameDto.gameToken = hashedGameToken;
		const options: FindOptionsWhere<GameEntity> = {
			gameToken: updateGameDto.gameToken,
		};
		try {
			await this.gameRepository.update(options, updateGameDto);
			return this.findOne(updateGameDto.gameToken);
		} catch (error) {
			throw new HttpException(ERROR_MESSAGE.concat(error.message), 500);
		}
	}

	async remove(gameToken: string): Promise<void> {
    const hashedGameToken = HashingService.hashData(gameToken);
    const options: FindOptionsWhere<GameEntity> = {
			 gameToken: hashedGameToken 
		};
		await this.gameRepository.delete(options);
	}

}
