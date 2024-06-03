import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameEntity } from '../entities/game.entity';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { CustomResponse } from 'src/helper/customResponse';
import Game from 'src/lib/Game';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() @Body() createGameDto: CreateGameDto): Promise<CustomResponse<GameEntity>> {
    return this.gameService.create(createGameDto);
  }

  @Get()
  async findAll(): Promise<GameEntity[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<GameEntity> {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto): Promise<GameEntity> {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.gameService.remove(id);
  }
}
