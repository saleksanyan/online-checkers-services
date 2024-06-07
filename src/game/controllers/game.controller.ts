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
import { UpdateGameDto } from '../dto/update-game.dto';
import { CustomResponse } from 'src/helper/customResponse';
import { PlayerEntity } from 'src/player/entities/player.entity';
@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get('NewGame')
	async create(): Promise<PlayerEntity> {
		return this.gameService.create();
	}
	@Get()
	async findAll(): Promise<GameEntity[]> {
		return this.gameService.findAll();
	}

	@Get(':gameID')
	async findOne(@Param('gameID') gameID: string): Promise<GameEntity> {
		return this.gameService.findOne(gameID);
	}

	@Patch()
	async update(@Body() updateGameDto: UpdateGameDto): Promise<GameEntity> {
		return this.gameService.update(updateGameDto);
	}

	@Delete(':gameID')
	async remove(@Param('gameID') gameID: string): Promise<GameEntity> {
		return this.gameService.remove(gameID);
	}

	@Patch(':gameID/pickAFigure/:position')
	async pickAFigure( @Param('gameID') gameID: string, 
		@Param('position') position: string ): Promise<CustomResponse<GameEntity>> {
		return this.gameService.pickAFigure(gameID, position);
	}

	@Patch(':gameID/undoMove/:index') 
	async undoMove(@Param('gameToken') gameID: string, @Param('index') index: string): Promise<GameEntity> { 
	return this.gameService.undoMove(gameID, index); 
 	} 

	@Patch(':gameToken/makeTheNextMove/:nextStep/') 
	async makeTheNextMove(@Param('gameToken') gameToken: string,
	 @Param('nextStep') nextStep: string): Promise<UpdateGameDto> { 
		return this.gameService.makeTheNextMove(gameToken, nextStep); 
	}
}
