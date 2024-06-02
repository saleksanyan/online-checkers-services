import Board from "./Board";

import { Color } from "./Constants";

import Validations from "./Validations";
import Position from "./Position";
import Figure from "./Figure";
import Move from "./Move";
import History from "./History";
import HelpingFunctions from "./HelpingFunctions";

class Game {
	board: Board;
	private currentFigure: Figure | null;
	private reachablePositionsOfCurrentFigure: Position[] | null;
	private moves: Move[] = [];

	constructor() {
		this.board = new Board();
		this.currentFigure = null;
		this.reachablePositionsOfCurrentFigure = null;
	}

	//example of move` 'a3'
	pickAFigure(move: string): Position[] | null {
		this.assignToNull();
		if (!Validations.isValidPosition(move, this.board)) {
			return null;
		}
		let position = new Position(move);
		let figure = this.board.getBoard()[position.getRow()][position.getColumn()];
		if (figure instanceof Figure) {
			this.currentFigure = figure;
			this.reachablePositionsOfCurrentFigure = this.currentFigure.reachablePositions(
				this.board,
				this.moves
			);
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
			const doesMoveComplete = this.currentFigure.move(
				nextPosition,
				this.reachablePositionsOfCurrentFigure,
				this.moves,
				this.board
			);
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

    goToPreviousStepByIndex(index: number) {
        const history = this.board.getHistory();
        const prevBoard = history.getByIndex(index);

    }

	undoMove(index: string): boolean {
		return HelpingFunctions.undoMove(index, this.board)
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
