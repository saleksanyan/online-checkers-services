import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { BoardEntity } from '../../board/entities/board.entity';
import Board from 'src/lib/Board';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/helper/statuses';
import { RESPONSE_MESSAGES } from 'src/helper/respose-messages';
import { CustomResponse } from 'src/helper/customResponse';
import { CreateGameDto } from '../dto/create-game.dto';


@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>
  ) {}

  async create(createGameDto: CreateGameDto): Promise<CustomResponse<GameEntity>> {
    const existingGame = await this.gameRepository.findOne({ where: { gameToken: createGameDto.gameToken } });

    if (existingGame) {
      return new CustomResponse<GameEntity>(
        SUCCESS_MESSAGE,
        existingGame,
        null,
        RESPONSE_MESSAGES.GAME_EXISTS
      );
    }

   
    const newGame = this.gameRepository.create(createGameDto);
    let boardEntity = new BoardEntity();
    boardEntity.board = new Board();
    newGame.board = boardEntity;
    console.log(boardEntity);
    try {
      await this.gameRepository.save(newGame);

      return new CustomResponse<GameEntity>(
        SUCCESS_MESSAGE,
        newGame,
        null,
        RESPONSE_MESSAGES.CREATE_GAME_SUCCESS
      );
    } catch (error) {
      console.error('Error creating GameEntity:', error);
      return new CustomResponse<GameEntity>(
        ERROR_MESSAGE,
        null,
        error.message,
        RESPONSE_MESSAGES.CREATE_GAME_FAIL
      );
    }
  }


  async findAll(): Promise<GameEntity[]> {
    return this.gameRepository.find({ relations: ['board'] });
  }

  async findOne(id: number): Promise<GameEntity> {
    const options: FindOneOptions<GameEntity> = {
      where: { id },
      relations: ['board'],
    };
    return this.gameRepository.findOne(options);
  }

  async update(id: number, updateGameDto: Partial<GameEntity>): Promise<GameEntity> {
    await this.gameRepository.update(id, updateGameDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.gameRepository.delete(id);
  }
}
