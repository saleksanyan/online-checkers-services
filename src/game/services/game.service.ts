import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/helper/statuses';
import { RESPONSE_MESSAGES } from 'src/helper/respose-messages';
import { CreateGameDto } from '../dto/create-game.dto';
import Game from 'src/lib/Game';
import { UpdateGameDto } from '../dto/update-game.dto';
import { HashingService } from 'src/helper/hashingService';
import { CustomResponse } from 'src/helper/customResponse';



@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameEntity)
		private readonly gameRepository: Repository<GameEntity>,
	) {}

	async create(
		createGameDto: CreateGameDto,
	): Promise<CustomResponse<GameEntity>> {
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
				null,
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
		const options: FindOneOptions<GameEntity> = {
			where: { gameToken: gameToken }
		};
		return this.gameRepository.findOne(options);
	}

	async update(updateGameDto: Partial<GameEntity>): Promise<GameEntity> {
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
		await this.gameRepository.delete(gameToken);
	}

	async pickAFigure(gameToken: string, startPosition: string): 
			Promise<CustomResponse<GameEntity>> {
		try {
			const gameResponse = await this.findOne(gameToken);
			
			if (!gameResponse.game) {
				return new CustomResponse<GameEntity>(
					ERROR_MESSAGE,
					null,
					null,
					RESPONSE_MESSAGES.GAME_NOT_FOUND
				);
			}

			let game = gameResponse.game;
			let position = game.pickAFigure(startPosition);
			if (position == null) {
				throw new HttpException(RESPONSE_MESSAGES.WRONG_POSITION, 500);
			}

			const updatedGameEntity = new GameEntity();
			updatedGameEntity.game = game;
			updatedGameEntity.gameToken = gameToken;
			await this.update(updatedGameEntity);

			return new CustomResponse<GameEntity>(
				SUCCESS_MESSAGE,
				updatedGameEntity,
				null,
				RESPONSE_MESSAGES.PICK_FIGURE_SUCCESS
			);
		} catch (error) {
			console.error('Error picking a figure:', error);
			throw new HttpException(ERROR_MESSAGE.concat(error.message), error.status);
		}
	}

	async undoMove(gameToken: string, index: string): Promise<GameEntity> { 
		try { 
			const game = await this.findOne(gameToken); 
			game.game.undoMove(index); 
		
			const gameDto = new UpdateGameDto(); 
			gameDto.game = game.game; 
			gameDto.gameToken = gameToken; 
			
			this.update(gameDto); 
		
			return game; 
			} catch (error) { 
			throw new HttpException(error, error.status); 
		} 
	}

	async makeTheNextMove(gameToken: string, nextMove: string): Promise<GameEntity> { 
		try { 
			const game = await this.findOne(gameToken); 
			if (game == null || !game.game.makeTheNextMove(nextMove)){ 
				throw new HttpException('Wrong next move', 500); 
			}
			const gameDto = new UpdateGameDto(); 
			gameDto.game = game.game; 
			gameDto.gameToken = gameToken; 
			
			this.update(gameDto); 
			return game;
		} catch (error) { 
		 throw new HttpException(error, error.status); 
		}
	}
}
