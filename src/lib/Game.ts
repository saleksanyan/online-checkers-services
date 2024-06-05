import Board from './Board';

import { Color } from './Constants';

import Validations from './Validations';
import Position from './Position';
import Figure from './Figure';
import Move from './Move';
import History from './History';
import HelpingFunctions from './HelpingFunctions';
import Pawn from './Pawn';
import Queen from './Queen';

class Game {
	board: Board;
	currentFigure: Figure;
<<<<<<< addedAPI
	reachablePositionsOfCurrentFigure: Position[] | null;
	moves: Move[] = [];
=======
	private reachablePositionsOfCurrentFigure: Position[] | null;
	private moves: Move[] = [];
>>>>>>> main

	constructor() {
		this.board = new Board();
		this.currentFigure = null;
		this.reachablePositionsOfCurrentFigure = null;
	}

<<<<<<< addedAPI
	
	toJSON() {
        let serializedReachablePositions = null;
        if (this.reachablePositionsOfCurrentFigure) {
            serializedReachablePositions = [];
            for (let i = 0; i < this.reachablePositionsOfCurrentFigure.length; i++) {
                serializedReachablePositions.push(this.reachablePositionsOfCurrentFigure[i].toJSON());
            }
        }

        let serializedMoves = [];
        for (let j = 0; j < this.moves.length; j++) {
            serializedMoves.push(this.moves[j].toJSON());
        }

        return {
            __class: 'Game',
            board: this.board.toJSON(),
            currentFigure: this.currentFigure ? this.currentFigure.toJSON() : null,
            reachablePositionsOfCurrentFigure: serializedReachablePositions,
            moves: serializedMoves,
        };
    }

    static fromJSON(json: any): Game {
        let game = new Game();
        game.board = Board.fromJSON(json.board);
		if(json.currentFigure != null){
			if(json.currentFigure.__class == 'Pawn'){
				game.currentFigure = Pawn.fromJSON(json.currentFigure); 
			}else{
				game.currentFigure = Queen.fromJSON(json.currentFigure);
			}
		}else{
        	game.currentFigure =  null;
		}
        let deserializedReachablePositions = null;
        if (json.reachablePositionsOfCurrentFigure) {
            deserializedReachablePositions = [];
            for (let i = 0; i < json.reachablePositionsOfCurrentFigure.length; i++) {
                deserializedReachablePositions.
				push(Position.fromJSON(json.reachablePositionsOfCurrentFigure[i]));
            }
        }
        game.reachablePositionsOfCurrentFigure = deserializedReachablePositions;

        let deserializedMoves = [];
        for (let j = 0; j < json.moves.length; j++) {
            deserializedMoves.push(Move.fromJSON(json.moves[j]));
        }
        game.moves = deserializedMoves;

        return game;
    }
	//example of move` 'a3'
	pickAFigure(startPosition: string): Position[] | null {
		this.assignToNull();

		if (!Validations.isValidPosition(startPosition, this.board)) {
			return null;
		}
		let position = new Position(startPosition);
=======
	static fromJSON(json: any): Game {
		return Object.assign(new Game(), json);
	}

	//example of move` 'a3'
	pickAFigure(currentPosition: string): Position[] | null {
		this.assignToNull();
		if (!Validations.isValidPosition(currentPosition, this.board)) {
			return null;
		}
		let position = new Position(currentPosition);
>>>>>>> main
		let figure = this.board.getBoard()[position.getRow()][position.getColumn()];
		if (figure instanceof Figure) { 
			this.currentFigure = figure;
			this.reachablePositionsOfCurrentFigure = this.currentFigure.reachablePositions(this.board, this.moves);
			return this.reachablePositionsOfCurrentFigure;
		}

		return null;
	}
	//example of next move` 'b4'
	makeTheNextMove(nextMove: string): boolean {
		const nextPosition = new Position(nextMove);
		if (!Validations.placeIsEmpty(nextPosition.getRow(), nextPosition.getColumn(), this.board)) {
			this.assignToNull();
			return false;
		}

		let isPositionPresent = false;
		this.reachablePositionsOfCurrentFigure?.forEach((pos) => {
			if (pos.getColumn() === nextPosition.getColumn() && pos.getRow() === nextPosition.getRow()) {
				isPositionPresent = true;
			}
		});

		if (!isPositionPresent) {
			this.assignToNull();
			return false;
		}
		if (this.currentFigure && this.reachablePositionsOfCurrentFigure) {
			const doesMoveComplete = this.currentFigure.move(nextPosition, this.reachablePositionsOfCurrentFigure, this.moves, this.board);
			if (doesMoveComplete) {
				this.board.changeTurn();
				return true;
			}
		}

		return false;
	}

	getBoardHistory(): History {
		return this.board.getHistory();
	}

	undoMove(index: string): boolean {
		return HelpingFunctions.undoMove(index, this.board);
	}

	getBoardMatrix(): (Figure | Color.EMPTY_PLACE)[][] {
		return this.board.getBoard();
	}

	isGameOver(): boolean {
		return this.board.DoesGameEnd();
	}

	whoWonTheGame(): Color | null {
		if (this.isGameOver()) {
			return this.board.getWhosTurn();
		}
		return null;
	}

	private assignToNull(): void {
		this.currentFigure = null;
		this.moves = [];
		this.reachablePositionsOfCurrentFigure = null;
	}
}

export default Game;
