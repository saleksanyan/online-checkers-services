import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { Game } from '../entities/game.entity';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    const { gameToken, board } = createGameDto;
    return this.gameService.create(gameToken, board);
  }

  @Get()
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Game> {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateGameDto: UpdateGameDto): Promise<Game> {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.gameService.remove(id);
  }
}
