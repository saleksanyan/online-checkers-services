import { Controller, Get, Body, Param, Delete, Patch, Post, Redirect } from '@nestjs/common';
import { GameService } from '../services/game.service';
import { GameEntity } from '../entities/game.entity';
import { UpdateGameDto } from '../dto/update-game.dto';
import { Public } from '../../helper/public.decorator';
import { PlayerEntity } from '../../player/entities/player.entity';

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	//game starting point
	//returns player 1 (entity)
	@Public()
	@Post('newGame')
	async create(): Promise<PlayerEntity> {
		return this.gameService.create();
	}
	
	//adds second player by giving game id, if the game exists and does not have 2 players
	//return: player(entity)
	@Public()
	@Post('addSecondPlayer/:gameID')
	async addSecondPlayer(@Param('gameID') gameID: string): Promise<PlayerEntity> {
		return this.gameService.addSecondPlayer(gameID);
	}


	//get: game entity by giving its id
	//return: game entity
	@Public()
	@Get(':gameID')
	async findOne(@Param('gameID') gameID: string): Promise<GameEntity> {
		return this.gameService.findOne(gameID);
	}

	//delete the game, deletes game and player entities
	//return: deleted game entity
	@Delete(':gameID')
	async remove(@Param('gameID') gameID: string): Promise<GameEntity> {
		return this.gameService.remove(gameID);
	}

	//input: game id and picking position
	//return: the game entity if game exists and the position is valid
	@Patch(':gameID/pickAFigure/:position')
	async pickAFigure(@Param('gameID') gameID: string, @Param('position') position: string): 
	Promise<GameEntity> {
		return this.gameService.pickAFigure(gameID, position);
	}

	//input: game id and index of the move that you want to return to
	//return: the game entity if game exists and if the index is valid
	@Patch(':gameID/undoMove/:index')
	async undoMove(@Param('gameToken') gameID: string, @Param('index') index: string): 
	Promise<GameEntity> {
		return this.gameService.undoMove(gameID, index);
	}

	//input: game id and next position
	//return: the game entity if game exists and next position is valid
	@Patch(':gameToken/makeTheNextMove/:nextStep/')
	async makeTheNextMove(@Param('gameToken') gameToken: string, @Param('nextStep') nextStep: string): Promise<UpdateGameDto> {
		return this.gameService.makeTheNextMove(gameToken, nextStep);
	}
}


