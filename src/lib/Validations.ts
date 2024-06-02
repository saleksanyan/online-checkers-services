import Position from "./Position";
import { BoardConstants, Color } from "./Constants";
import Board from "./Board";
import Figure from "./Figure";

class Validations {
	public static isValidPlace(row: number, column: number): boolean {
		return column < BoardConstants.COLUMNS && row < BoardConstants.ROWS && column >= 0 && row >= 0;
	}

	public static isValidPosition(userInput: string, board: Board): boolean {
		if (userInput.length !== 2) return false;
		if (!this.isNumber(userInput.charAt(1))) return false;
		let position = new Position(userInput);
		let figure = board.getBoard()[position.getRow()][position.getColumn()];
		let hasSameColor = false;
		if (figure instanceof Figure) {
			hasSameColor = figure.getColor() === board.getWhosTurn();
		}
		return hasSameColor && this.isValidPlace(position.getRow(), position.getColumn());
	}

	public static notStepBack(figurColor: Color, row: number, currentPosition: Position) {
		if (figurColor === Color.WHITE) {
			return currentPosition.getRow() > row;
		}
		return currentPosition.getRow() < row;
	}

	public static placeIsEmpty(row: number, column: number, board: Board): boolean {
		return board.getBoard()[row][column] === Color.EMPTY_PLACE;
	}
	public static isNumber(value: string): boolean {
		return value !== "" && !isNaN(Number(value.toString()));
	}
}

export default Validations;
