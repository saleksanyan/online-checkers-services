import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
} from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameEntity } from '../entities/game.entity';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import { CustomResponse } from 'src/helper/customResponse';
import { HashingService } from 'src/helper/hashingService';

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Post()
	async create(@Body() createGameDto: CreateGameDto): Promise<CustomResponse<GameEntity>> {
		const initalGameToken = createGameDto.gameToken;
    const hashedGameToken = HashingService.hashData(initalGameToken);
    createGameDto.gameToken = hashedGameToken;
    return this.gameService.create(createGameDto);
	}
	@Get()
	async findAll(): Promise<GameEntity[]> {
		return this.gameService.findAll();
	}

	@Get(':gameToken')
	async findOne(@Param('gameToken') gameToken: string): Promise<GameEntity> {
    const initalGameToken = gameToken;
    const hashedGameToken = HashingService.hashData(initalGameToken);
		return this.gameService.findOne(hashedGameToken);
	}

	@Patch()
	async update(@Body() updateGameDto: UpdateGameDto): Promise<GameEntity> {
    const initalGameToken = updateGameDto.gameToken;
    const hashedGameToken = HashingService.hashData(initalGameToken);
    updateGameDto.gameToken = hashedGameToken;
		return this.gameService.update(updateGameDto);
	}

	@Delete(':gameToken')
	async remove(@Param('gameToken') gameToken: string): Promise<void> {
    const hashedGameToken = HashingService.hashData(gameToken);
		return this.gameService.remove(hashedGameToken);
	}

}
