import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/helper/statuses';
import { RESPONSE_MESSAGES } from 'src/helper/respose-messages';
import { CustomResponse } from 'src/helper/costumResponse';
import { CreateGameDto } from '../dto/create-game.dto';
import Game from 'src/lib/Game';
<<<<<<< addedAPI
import { UpdateGameDto } from '../dto/update-game.dto';
import { HashingService } from 'src/helper/hashingService';


=======
import { HashingService } from 'src/helper/hashingService';
import { UpdateGameDto } from '../dto/update-game.dto';
import Position from 'src/lib/Position';
>>>>>>> main

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameEntity)
		private readonly gameRepository: Repository<GameEntity>,
	) {}

	async create(createGameDto: CreateGameDto): Promise<CustomResponse<GameEntity>> {
		//hashing
		const initalGameToken = createGameDto.gameToken;
		const hashedGameToken = HashingService.hashData(initalGameToken);
		createGameDto.gameToken = hashedGameToken;

		const existingGame = await this.gameRepository.findOne({
			where: { gameToken: createGameDto.gameToken },
		});

		if (existingGame) {
<<<<<<< addedAPI
			return new CustomResponse<GameEntity>(SUCCESS_MESSAGE, 
				existingGame, null, RESPONSE_MESSAGES.GAME_EXISTS);
=======
			return new CustomResponse<GameEntity>(SUCCESS_MESSAGE, existingGame, null, RESPONSE_MESSAGES.GAME_EXISTS);
>>>>>>> main
		}
		createGameDto.game = new Game();
		const newGame = this.gameRepository.create(createGameDto);
		try {
			await this.gameRepository.save(newGame);

<<<<<<< addedAPI
			return new CustomResponse<GameEntity>(SUCCESS_MESSAGE, newGame, 
				RESPONSE_MESSAGES.CREATE_GAME_SUCCESS);
=======
			return new CustomResponse<GameEntity>(SUCCESS_MESSAGE, newGame, RESPONSE_MESSAGES.CREATE_GAME_SUCCESS);
>>>>>>> main
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
<<<<<<< addedAPI
		const hashedGameToken = HashingService.hashData(gameToken);
		const options: FindOneOptions<GameEntity> = {
				where: { gameToken: hashedGameToken },
			};
		return this.gameRepository.findOne(options);
=======
    const hashedGameToken = HashingService.hashData(gameToken);
    const options: FindOneOptions<GameEntity> = {
			where: { gameToken: hashedGameToken },
		};
    return this.gameRepository.findOne(options);
>>>>>>> main
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
			gameToken: hashedGameToken,
		};
		await this.gameRepository.delete(options);
	}

<<<<<<< addedAPI
	async pickAFigure(gameToken: string, startPosition: string): 
			Promise<GameEntity> {
		try {
			const hashedGameToken = HashingService.hashData(gameToken); 
			const gameResponse = await this.findOne(hashedGameToken);
			if (!gameResponse.game) {
				throw new HttpException(RESPONSE_MESSAGES.WRONG_POSITION, 400);;
			}

			let game = gameResponse.game;
			let position = game.pickAFigure(startPosition);
			if (position == null) {
				throw new HttpException(RESPONSE_MESSAGES.PICK_FIGURE_FAIL, 500);
			}

			const updatedGameEntity = new GameEntity();
			updatedGameEntity.game = game;
			updatedGameEntity.gameToken = hashedGameToken;
			await this.update(updatedGameEntity);

			return updatedGameEntity;

		} catch (error) {
			console.error('Error picking a figure:', error);
			throw new HttpException(ERROR_MESSAGE.concat(error.message), error.status);
		}
	}

=======
>>>>>>> main
	async undoMove(gameToken: string, index: string): Promise<GameEntity> {
		try {
			const game = await this.findOne(gameToken);
			game.game.undoMove(index);

			const hashedGameToken = HashingService.hashData(gameToken);

			const gameDto = new UpdateGameDto();
			gameDto.game = game.game;
<<<<<<< addedAPI
			gameDto.gameToken = hashedGameToken;
=======
			game.gameToken = hashedGameToken;
>>>>>>> main

			this.update(gameDto);

			return game;
		} catch (error) {
			throw new HttpException(error, 400);
		}
	}

<<<<<<< addedAPI

	async makeTheNextMove(gameToken: string, nextMove: string): Promise<GameEntity> { 
		try { 
	   
		 const game = await this.findOne(gameToken); 
		 console.log(game);
		 if (!game.game.makeTheNextMove(nextMove)) { 
		  throw new HttpException('Wrong next move', 400); 
		 } 
	   
		 const hashedGameToken = HashingService.hashData(gameToken); 
	   
		 const gameDto = new UpdateGameDto(); 
		 gameDto.game = game.game; 
		 gameDto.gameToken = hashedGameToken;
		 this.update(gameDto); 
		 return game;
		} catch (error) { 
		 throw new HttpException(error, error.status); 
		} 
	}

	  
=======
	async pickAFigure(gameToken: string, currentPosition: string): Promise<GameEntity> {
		try { 
      const game = await this.findOne(gameToken);
      const reachablePositionsOfTheFigure = game.game.pickAFigure(currentPosition)
      
      if (!reachablePositionsOfTheFigure) {
				throw new HttpException('Wrong Position', 400);
			}
      
			const hashedGameToken = HashingService.hashData(gameToken);

			const gameDto = new UpdateGameDto();
			gameDto.game = game.game;
			game.gameToken = hashedGameToken;

			this.update(gameDto);

			return game;
		} catch (error) {
			throw new HttpException(error, error.status);
		}
	}

	async makeTheNextMove(gameToken: string, nextMove: string): Promise<void> {
		try {

			const game = await this.findOne(gameToken);

			if (!game.game.makeTheNextMove(nextMove)) {
				throw new HttpException('Wrong next move', 400);
			}

			const hashedGameToken = HashingService.hashData(gameToken);

			const gameDto = new UpdateGameDto();
			gameDto.game = game.game;
			game.gameToken = hashedGameToken;

			this.update(gameDto);
      
		} catch (error) {
			throw new HttpException(error, error.status);
		}
	}
>>>>>>> main
}
