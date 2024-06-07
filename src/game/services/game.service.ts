import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/helper/statuses';
import { RESPONSE_MESSAGES } from 'src/helper/respose-messages';
import Game from 'src/lib/Game';
import { UpdateGameDto } from '../dto/update-game.dto';
import { CustomResponse } from 'src/helper/customResponse';
import { PlayerEntity } from 'src/player/entities/player.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateGameDto } from '../dto/create-game.dto';

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
		const newGame = this.gameRepository.create(createGameDto);
		let player = this.playerRepository.create();
		player.game = newGame;
		player.jwtPlayer = this.jwtService.sign({ playerId: player.id });
		try {
			await this.gameRepository.save(newGame);
			await this.playerRepository.save(player);
			return player;
		} catch (error) {
			console.error('Error creating GameEntity:', error);
			throw new HttpException(ERROR_MESSAGE.concat(error.message), 500);
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
			return this.findOne(updateGameDto.id);
		} catch (error) {
			throw new HttpException(ERROR_MESSAGE.concat(error.message), 500);
		}
	}

	async remove(id: string): Promise<GameEntity> {
		let game = this.findOne(id);
		await this.gameRepository.delete(id);
		return game;
	}

	async pickAFigure(id: string, startPosition: string): Promise<CustomResponse<GameEntity>> {
		try {
			const gameResponse = await this.findOne(id);
			if (!gameResponse.game) {
				return new CustomResponse<GameEntity>(ERROR_MESSAGE, null, null, RESPONSE_MESSAGES.GAME_NOT_FOUND);
			}

			let game = gameResponse.game;
			let position = game.pickAFigure(startPosition);
			if (position == null) {
				throw new HttpException(RESPONSE_MESSAGES.WRONG_POSITION, 500);
			}

			const updatedGameEntity = new GameEntity();
			updatedGameEntity.game = game;
			updatedGameEntity.id = id;
			await this.update(updatedGameEntity);

			return new CustomResponse<GameEntity>(SUCCESS_MESSAGE, updatedGameEntity, null, RESPONSE_MESSAGES.PICK_FIGURE_SUCCESS);
		} catch (error) {
			console.error('Error picking a figure:', error);
			throw new HttpException(ERROR_MESSAGE.concat(error.message), error.status);
		}
	}

	async undoMove(id: string, index: string): Promise<GameEntity> {
		try {
			const game = await this.findOne(id);
			game.game.undoMove(index);

			const gameDto = new UpdateGameDto();
			gameDto.game = game.game;
			gameDto.id = id;

			this.update(gameDto);

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

			this.update(gameDto);
			return game;
		} catch (error) {
			throw new HttpException(error, error.status);
		}
	}
}
