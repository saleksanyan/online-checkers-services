import Position from "./Position";
import Validations from "./Validations";
import Board from "./Board";
import { BoardConstants, Color } from "./Constants";
import Figure from "./Figure";
import Pawn from "./Pawn";
import Queen from "./Queen";
import Move from "./Move";

class HelpingFunctions {
	public static findPath(
		reachableMoves: Move[],
		nextPosition: Position,
		currentPosition: Position
	): Move[] {
		let startIndex: number = 0;
		let endIndex: number = 0;

		for (let positionIndex = 0; positionIndex < reachableMoves.length; positionIndex++) {
			let pos = reachableMoves[positionIndex];

			if (
				pos.getDest().getColumn() === nextPosition.getColumn() &&
				pos.getDest().getRow() === nextPosition.getRow()
			) {
				break;
			}
			endIndex++;
		}
		startIndex = endIndex;
		for (let positionIndex = endIndex; positionIndex >= 0; positionIndex--) {
			let pos = reachableMoves[positionIndex];
			if (
				pos.getStart().getColumn() === currentPosition.getColumn() &&
				pos.getStart().getRow() === currentPosition.getRow()
			) {
				break;
			}
			startIndex--;
		}

		return reachableMoves.slice(startIndex, endIndex + 1);
	}

	public static isReachablePosition(position: Position, reachablePositions: Position[]) {
		return reachablePositions.some(
			(pos) => pos.getColumn() === position.getColumn() && pos.getRow() === position.getRow()
		);
	}

	public static wasNotRepeatedStap(
		allDestinations: Position[],
		figuresNewRow: number,
		figuresNewColumn: number
	): boolean {
		return !allDestinations.some(
			(pos) => pos.getColumn() === figuresNewColumn && pos.getRow() === figuresNewRow
		);
	}
	public static addingPositionToArray(
		figuresNewRow: number,
		figuresNewColumn: number,
		reachablePositions: Position[]
	): Position {
		let pos = Position.getPositionUsingBoardPlaces(figuresNewRow, figuresNewColumn);
		let destPosition = new Position(pos);
		reachablePositions.push(destPosition);
		return new Position(pos);
	}

	public static deleteAllfiguresBetweenGivenPositions(
		start: Position,
		dest: Position,
		board: Board
	): boolean {
		let startRow = start.getRow();
		let startColumn = start.getColumn();
		let destRow = dest.getRow();
		let destColumn = dest.getColumn();

		let eat = false;

		while (startRow > destRow && startColumn > destColumn) {
			startRow--;
			startColumn--;

			if (!Validations.placeIsEmpty(startRow, startColumn, board)) {
				HelpingFunctions.decrementCounter(board, startRow, startColumn);

				eat = true;

				board.getBoard()[startRow][startColumn] = Color.EMPTY_PLACE;
			}
		}

		while (startRow < destRow && startColumn < destColumn) {
			startRow++;
			startColumn++;

			if (!Validations.placeIsEmpty(startRow, startColumn, board)) {
				HelpingFunctions.decrementCounter(board, startRow, startColumn);

				eat = true;

				board.getBoard()[startRow][startColumn] = Color.EMPTY_PLACE;
			}
		}

		while (startRow < destRow && startColumn > destColumn) {
			startRow++;
			startColumn--;

			if (!Validations.placeIsEmpty(startRow, startColumn, board)) {
				HelpingFunctions.decrementCounter(board, startRow, startColumn);

				eat = true;

				board.getBoard()[startRow][startColumn] = Color.EMPTY_PLACE;
			}
		}

		while (startRow > destRow && startColumn < destColumn) {
			startRow--;
			startColumn++;

			if (!Validations.placeIsEmpty(startRow, startColumn, board)) {
				HelpingFunctions.decrementCounter(board, startRow, startColumn);

				eat = true;

				board.getBoard()[startRow][startColumn] = Color.EMPTY_PLACE;
			}
		}

		return eat;
	}

	private static decrementCounter(board: Board, row: number, column: number) {
		let figure = board.getBoard()[row][column];

		if (figure instanceof Figure) {
			if (figure.getColor() === Color.BLACK) {
				board.decrementBlackCounter();
			} else {
				board.decrementWhiteCounter();
			}
		}
	}

	public static constructBoard(boardMatrix: (Figure | string)[][]) {
		for (let row = 0; row < BoardConstants.ROWS; row++) {
			for (let column = 0; column < BoardConstants.COLUMNS; column++) {
				if ((row + column) % 2 !== 0 && row < (BoardConstants.ROWS - 2) / 2) {
					boardMatrix[row][column] = new Pawn(
						Color.BLACK,
						new Position(Position.getPositionUsingBoardPlaces(row, column))
					);
				} else if ((row + column) % 2 !== 0 && row > BoardConstants.ROWS / 2) {
					boardMatrix[row][column] = new Pawn(
						Color.WHITE,
						new Position(Position.getPositionUsingBoardPlaces(row, column))
					);
				} else {
					boardMatrix[row][column] = Color.EMPTY_PLACE;
				}
			}
		}
	}

	private static becomeQueen(row: number, column: number, board: Board) {
		let boardPlate = board.getBoard();
		let figure = boardPlate[row][column];

		if (!(figure instanceof Pawn)) {
			return;
		}
		if (row !== 0 && figure.getColor() === Color.WHITE) {
			return;
		} else if (figure.getColor() === Color.BLACK && row !== 7) {
			return;
		}

		boardPlate[row][column] = new Queen(
			figure.getColor(),
			new Position(Position.getPositionUsingBoardPlaces(row, column))
		);
	}

	public static swap(newRow: number, newColumn: number, row: number, column: number, board: Board) {
		let boardPlate = board.getBoard();

		let temp = boardPlate[row][column];

		boardPlate[newRow][newColumn] = temp;

		boardPlate[row][column] = Color.EMPTY_PLACE;

		HelpingFunctions.becomeQueen(newRow, newColumn, board);
	}

	public static deepCopyMatrix(
		board: (Figure | Color.EMPTY_PLACE)[][]
	): (Figure | Color.EMPTY_PLACE)[][] {
		return board.map((row) =>
			row.map((item) => {
				if (item instanceof Queen) {
					return new Queen(item.getColor(), item.getCurrentPosition());
				} else if (item instanceof Pawn) {
					return new Pawn(item.getColor(), item.getCurrentPosition());
				} else {
					return item;
				}
			})
		);
	}

	public static undoMove(userChoice: string, board: Board): boolean {
		if (!Validations.isNumber(userChoice)) {
			return false;
		}
		const userChoiceNum = Number(userChoice);
	
		let history = board.getHistory();
		let stepHistory = history.getSteps();
		if (userChoiceNum < 0 || userChoiceNum >= stepHistory.length) {
			return false;
		}
		let boardHistory = history.getBoardHistory();
		let index = parseInt(userChoice.charAt(1));
		board.setBoard(history.changeBoard(index));
		history.setBoardHistory(boardHistory.slice(0, index + 1));
		history.setStepHistory(stepHistory.slice(0, index));
		HelpingFunctions.changeCountOfFigures(board);

		return true;
	}

	public static changeCountOfFigures(board: Board): void {
		let whites = 0;
		let blacks = 0;
		let checkersBoard = board.getBoard();

		for (let row = 0; row < BoardConstants.ROWS; row++) {
			for (let column = 0; column < BoardConstants.COLUMNS; column++) {
				let figure = checkersBoard[row][column];

				if (figure instanceof Figure) {
					if (figure.getColor() === Color.BLACK) {
						blacks++;
					} else {
						whites++;
					}
				}
			}
		}

		board.setBlackCount(blacks);
		board.setWhiteCount(whites);
	}
}

export default HelpingFunctions;
