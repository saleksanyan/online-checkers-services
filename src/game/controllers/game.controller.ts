import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	BadRequestException,
} from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameEntity } from '../entities/game.entity';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { CustomResponse } from 'src/helper/customResponse';

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post()
	async create(
		@Body() createGameDto: CreateGameDto,
	): Promise<CustomResponse<GameEntity>> {
		return this.gameService.create(createGameDto);
	}
	@Get()
	async findAll(): Promise<GameEntity[]> {
		return this.gameService.findAll();
	}

	@Get(':game')
	async findOne(@Param('gameToken') gameToken: string): Promise<GameEntity> {
		return this.gameService.findOne(gameToken);
	}

	@Patch()
	async update(@Body() updateGameDto: UpdateGameDto): Promise<GameEntity> {
		return this.gameService.update(updateGameDto);
	}

	@Delete(':deleteGame')
	async remove(@Param('gameToken') gameToken: string): Promise<void> {
		return this.gameService.remove(gameToken);
	}

	@Patch(':gameToken/undoMove/:index')
	async undoMove(@Param('gameToken') gameToken: string, @Param('index') index: string): Promise<GameEntity> {
		const indexNumber = parseInt(index, 10);
		if (isNaN(indexNumber)) {
			throw new BadRequestException('Index must be a number');
		}
		return this.gameService.undoMove(gameToken, index);
	}
}
