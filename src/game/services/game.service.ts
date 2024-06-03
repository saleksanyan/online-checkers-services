import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { GameEntity } from '../entities/game.entity';
import { BoardEntity } from '../../board/entities/board.entity';


@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    @InjectRepository(BoardEntity)
    private readonly boardRepository: Repository<BoardEntity>,
  ) {}

  async create(gameToken: string, board: BoardEntity): Promise<GameEntity> {
    const game = this.gameRepository.create({ gameToken, board });
    return this.gameRepository.save(game);
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
