import { Entity, Column, Index, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import Game from 'src/lib/Game';
import Board from 'src/lib/Board';
import History from 'src/lib/History';
import { Color, FigureType } from 'src/lib/Constants';
import Figure from 'src/lib/Figure';
import Pawn from 'src/lib/Pawn';
import Queen from 'src/lib/Queen';

function reviveInstance<T>(cls: new (...args: any[]) => T, json: any): T {
	return Object.assign(new cls(), json);
}
const gameTransformer: ValueTransformer = {
	to: (game: Game) => JSON.stringify(game),
	from: (value: string) => {
		const gamefromJson: Game = Game.fromJSON(JSON.parse(value));
		gamefromJson.board = Board.fromJSON(gamefromJson.board);
    
    gamefromJson.board.history = History.fromJSON(gamefromJson.board.history);
		const boardMatrix = gamefromJson.board.getBoard();
    
		for (let row = 0; row < boardMatrix.length; row++) {
			for (let column = 0; column < boardMatrix[row].length; column++) {
				if (boardMatrix[row][column] !== Color.EMPTY_PLACE) {
					if ((boardMatrix[row][column] as Figure).figureType === FigureType.PAWN) {
            boardMatrix[row][column] = Pawn.fromJSON(boardMatrix[row][column]);
          } else if ((boardMatrix[row][column] as Figure).figureType === FigureType.PAWN) {
            boardMatrix[row][column] = Queen.fromJSON(boardMatrix[row][column]);
          }
				}
			}
		}
		return gamefromJson;
	},
};

@Entity()
export class GameEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ nullable: false })
	@Index({ unique: true })
	gameToken: string;

	@Column({ type: 'json', transformer: gameTransformer })
	game: Game;
}
