import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Board } from '../../board/entities/board.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(gameToken: string, board: Board): Promise<Game> {
    const game = this.gameRepository.create({ gameToken, board });
    return this.gameRepository.save(game);
  }

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find({ relations: ['board'] });
  }

  async findOne(id: number): Promise<Game> {
    const options: FindOneOptions<Game> = {
      where: { id },
      relations: ['board'],
    };
    return this.gameRepository.findOne(options);
  }

  async update(id: number, updateGameDto: Partial<Game>): Promise<Game> {
    await this.gameRepository.update(id, updateGameDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.gameRepository.delete(id);
  }
}
