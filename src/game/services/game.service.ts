import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { UpdateGameDto } from '../dto/update-game.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateGameDto } from '../dto/create-game.dto';
import { RESPONSE_MESSAGES } from '../../helper/respose-messages';
import { ERROR_MESSAGE } from '../../helper/statuses';
import Game from '../../lib/Game';
import { PlayerEntity } from '../../player/entities/player.entity';

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(GameEntity)
		private readonly gameRepository: Repository<GameEntity>,
		@InjectRepository(PlayerEntity)
		private readonly playerRepository: Repository<PlayerEntity>,
		private readonly jwtService: JwtService,
	) {}

	async create(): Promise<PlayerEntity> {
		let createGameDto = new CreateGameDto();
		createGameDto.game = new Game();
	
	
		let player = this.playerRepository.create();
		createGameDto.players = [player.id];
		const newGame = this.gameRepository.create(createGameDto);
		player.gameID = newGame.id;
		player.jwtPlayer = this.jwtService.sign({ playerId: player.id });
	
		try {
		  await this.playerRepository.save(player);
		  await this.gameRepository.save(newGame);
	
		  return player;
		} catch (error) {
		  throw new HttpException(`Error creating GameEntity: ${error.message}`, 500);
		}
	  }
	  

	async findAll(): Promise<GameEntity[]> {
		return this.gameRepository.find();
	}


	async findOne(gameID: string): Promise<GameEntity> {
		const options: FindOneOptions<GameEntity> = {
			where: { id: gameID },
		};		
		return this.gameRepository.findOne(options);
	}

	async update(updateGameDto: Partial<GameEntity>): Promise<GameEntity> {
		const options: FindOptionsWhere<GameEntity> = {
			id: updateGameDto.id,
		};
		try {
			await this.gameRepository.update(options, updateGameDto);
			return await this.findOne(updateGameDto.id);
		} catch (error) {
			throw new HttpException(ERROR_MESSAGE.concat(error.message), 500);
		}
	}

	async remove(id: string): Promise<GameEntity> {
		let game = this.findOne(id);
		let players = (await game).players;
		this.playerRepository.delete(players[0]);
		if(players.length === 2){
			await this.playerRepository.delete(players[1])
		}
		await this.gameRepository.delete(id);
		return game;
	}

	async pickAFigure(id: string, startPosition: string): Promise<GameEntity> {
		try {
			const gameResponse = await this.findOne(id);
			if (!gameResponse.game) {
				throw new HttpException(RESPONSE_MESSAGES.GAME_NOT_FOUND, 500); 
			}
			let game = gameResponse.game;
			let position = game.pickAFigure(startPosition);
			if (position == null) {
				throw new HttpException(RESPONSE_MESSAGES.WRONG_POSITION, 500);
			}
			const updatedGameEntity = this.gameRepository.create();
			updatedGameEntity.game = game;
			updatedGameEntity.id = id;
			await this.update(updatedGameEntity);

			return updatedGameEntity;
		} catch (error) {
			console.error('Error picking a figure:', error);
			throw new HttpException(ERROR_MESSAGE.concat(error.message), error.status);
		}
	}

	async undoMove(id: string, index: string): Promise<GameEntity> {
		try {
			const game = await this.findOne(id);
			if (!game.game.undoMove(index)){
				throw new HttpException(RESPONSE_MESSAGES.WRONG_COLOR, 500);
			};

			const gameDto = new UpdateGameDto();
			gameDto.game = game.game;
			gameDto.id = id;

			await this.update(gameDto);

			return game;
		} catch (error) {
			throw new HttpException(error, error.status);
		}
	}

	async makeTheNextMove(id: string, nextMove: string): Promise<GameEntity> {
		try {
			const game = await this.findOne(id);
			if (game == null || !game.game.makeTheNextMove(nextMove)) {
				throw new HttpException('Wrong next move', 500);
			}
			const gameDto = new UpdateGameDto();
			gameDto.game = game.game;
			gameDto.id = id;

			// await this.update(gameDto);
			let gameEntity = await this.findOne(gameDto.id);
			return this.update(gameDto);;
		} catch (error) {
			throw new HttpException(error, error.status);
		}
	}

	async addSecondPlayer(gameID: string): Promise<PlayerEntity> {
		try {
		  const game = await this.gameRepository.findOne({ where: { id: gameID }});
		  if (!game) {
			throw new HttpException('Game not found', 404);
		  }
	
		  const players = game.players;
		  if (players.length < 2) {
			let secondPlayer = this.playerRepository.create();
			secondPlayer.gameID = game.id;
			secondPlayer.jwtPlayer = this.jwtService.sign({ playerId: secondPlayer.id });
			await this.playerRepository.save(secondPlayer);
			game.players.push(secondPlayer.id);
        	await this.gameRepository.save(game);			
			return secondPlayer;
		  } else {
			throw new HttpException('Game already has two players', 400);
		  }
		} catch (error) {
		  throw new HttpException(error.message, error.status || 500);
		}
	}
}