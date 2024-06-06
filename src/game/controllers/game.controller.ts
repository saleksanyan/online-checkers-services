import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	Query,
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

	@Get(':gameToken')
	async findOne(@Param('gameToken') gameToken: string): Promise<GameEntity> {
		return this.gameService.findOne(gameToken);
	}

	@Patch()
	async update(@Body() updateGameDto: UpdateGameDto): Promise<GameEntity> {
		return this.gameService.update(updateGameDto);
	}

	@Delete(':gameToken')
	async remove(@Param('gameToken') gameToken: string): Promise<GameEntity> {
		return this.gameService.remove(gameToken);
	}

	@Patch(':gameToken/pickAFigure/:position')
	async pickAFigure( @Param('gameToken') gameToken: string, 
		@Param('position') position: string ): Promise<CustomResponse<GameEntity>> {
		return this.gameService.pickAFigure(gameToken, position);
	}

	@Patch(':gameToken/undoMove/:index') 
	async undoMove(@Param('gameToken') gameToken: string, @Param('index') index: string): Promise<GameEntity> { 
	return this.gameService.undoMove(gameToken, index); 
 	} 

	@Patch(':gameToken/makeTheNextMove/:nextStep/') 
	async makeTheNextMove(@Param('gameToken') gameToken: string,
	 @Param('nextStep') nextStep: string): Promise<UpdateGameDto> { 
		return this.gameService.makeTheNextMove(gameToken, nextStep); 
	}
}
