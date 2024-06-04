import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, DataSource } from 'typeorm';
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


  async findAll(): Promise<CustomResponse<GameEntity[]>> {
    let games = this.gameRepository.find({ relations: ['board'] });
    if(games != null){
      return new CustomResponse<GameEntity[]>(
        SUCCESS_MESSAGE,
        await games,
        null,
        RESPONSE_MESSAGES.GAME_FOUND, 
      );
    }
    return new CustomResponse<GameEntity[]>(
      ERROR_MESSAGE,
      null,
      null,
      RESPONSE_MESSAGES.GAME_WAS_NOT_FOUND 
    );
    
  }

  async findOne(gameToken: string): Promise<CustomResponse<GameEntity>> {
    const options: FindOneOptions<GameEntity> = {
      where: { gameToken: gameToken },
      relations: ['board'],
    };
    console.log(gameToken)

    try {
      const foundGame = await this.gameRepository.findOne(options);
        
      return new CustomResponse<GameEntity>(
        SUCCESS_MESSAGE,
        foundGame,
        null,
        RESPONSE_MESSAGES.GAME_FOUND
      );
        
    } catch (error) {
        console.error('Error finding game:', error);
        return new CustomResponse<GameEntity>(
            ERROR_MESSAGE,
            null,
            error.message,
            RESPONSE_MESSAGES.GAME_WAS_NOT_FOUND
        );
    }
  }

  async update(updateGameDto: Partial<GameEntity>): Promise<CustomResponse<GameEntity>> {
    try {
      let data = this.findOne(updateGameDto.gameToken);
      await this.gameRepository.update((await data).data.id, updateGameDto);
      let returnData = this.findOne(updateGameDto.gameToken);
      return returnData;
    } 
    catch (error) {
        console.error('Error updating GameEntity:', error);
        return new CustomResponse<GameEntity>(
            ERROR_MESSAGE, 
            null,
            error.message,
            RESPONSE_MESSAGES.UPDATE_GAME_FAIL
        );
    }
  }


  async remove(gameToken: string): Promise<void> {
    let data = this.findOne(gameToken);
    await this.gameRepository.delete((await data).data.id);
  }
}
