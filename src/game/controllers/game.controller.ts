import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameEntity } from '../entities/game.entity';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { CustomResponse } from 'src/helper/customResponse';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() @Body() createGameDto: CreateGameDto): Promise<CustomResponse<GameEntity>> {
    return this.gameService.create(createGameDto);
  }

  @Get()
  async findAll(): Promise<CustomResponse<GameEntity[]>> {
    return this.gameService.findAll();
  }

  @Get(':gameToken')
  async findOne(@Param('gameToken') gameToken: string): Promise<CustomResponse<GameEntity>> {
    return this.gameService.findOne(gameToken);
  }

  @Patch()
  async update(@Body() updateGameDto: UpdateGameDto): Promise<CustomResponse<GameEntity>> {
    return this.gameService.update(updateGameDto);
  }

  @Delete(':gameToken')
  async remove(@Param('gameToken') gameToken: string): Promise<void> {
    return this.gameService.remove(gameToken);
  }
}
