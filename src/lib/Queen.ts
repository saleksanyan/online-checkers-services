import Figure from "./Figure";
import Validations from "./Validations";
import Position from "./Position";

import { BoardConstants, Color } from "./Constants";
import Board from "./Board";
import HelpingFunctions from "./HelpingFunctions";
import Move from "./Move";

class Queen extends Figure {
	constructor(color: Color, position: Position) {
		super(color, position);
	}

	reachablePositions(board: Board, moves: Move[]): Position[] {
		let visited = new Array(BoardConstants.ROWS)
			.fill(null)
			.map(() => new Array(BoardConstants.COLUMNS).fill(false));
		return this.allDestinations(this.currentPosition, board, false, [], moves, visited);
	}

	allDestinations(
		position: Position,
		board: Board,
		afterEating: boolean,
		allDestinations: Position[],
		moves: Move[],
		visited: boolean[][]
	): Position[] {
		if (!(this instanceof Queen)) {
			return [];
		}
		const directions = [
			{ rowChange: -1, colChange: -1 },
			{ rowChange: -1, colChange: 1 },
			{ rowChange: 1, colChange: -1 },
			{ rowChange: 1, colChange: 1 },
		];
		for (const { rowChange, colChange } of directions) {
			let row = position.getRow() + rowChange;
			let column = position.getColumn() + colChange;
			let isCaptured = false;
			let afterEatingFlag = false;
			let sameColorFigure = false;
			let eatablePositions: number[] = [];

			while (Validations.isValidPlace(row, column)) {
				let backToSamePosition =
					this.currentPosition.getColumn() === column && this.currentPosition.getRow() === row;
				if (!sameColorFigure) {

					if (isCaptured && (Validations.placeIsEmpty(row, column, board) || backToSamePosition)) {
						isCaptured = false;
					}
					if (
						!visited[row][column] &&
						!Validations.placeIsEmpty(row, column, board) &&
						!backToSamePosition
					) {
						const figure = board.getBoard()[row][column];
						if (figure instanceof Figure) {
							if (!isCaptured && !visited[row][column] && this.hasOppositeColor(figure)) {
								isCaptured = true;
								afterEatingFlag = true;
								eatablePositions = [row, column];
							} else if (
								!(
									this.currentPosition.getColumn() === column &&
									this.currentPosition.getRow() === row
								) &&
								!this.hasOppositeColor(figure)
							) {
								sameColorFigure = true;
							} else if (isCaptured && this.hasOppositeColor(figure)) {
								visited[row][column] = true;
								break;
							}
						}
					} else if (!isCaptured && (!afterEating || afterEatingFlag)) {
						if (afterEatingFlag && !visited[row][column]) {
							visited[row][column] = true;
							let nextPos = HelpingFunctions.addingPositionToArray(row, column, allDestinations);
							moves.push(new Move(position, nextPos));
							let eatableFigureRow = eatablePositions[0];
							let eatableFigureColumn = eatablePositions[1];
							visited[eatableFigureRow][eatableFigureColumn] = true;
							this.allDestinations(nextPos, board, true, allDestinations, moves, visited);
							visited[row][column] = false;
							afterEatingFlag = false;
						} else if (!visited[row][column]) {
							HelpingFunctions.addingPositionToArray(row, column, allDestinations);
							moves.push(
								new Move(position, new Position(Position.getPositionUsingBoardPlaces(row, column)))
							);
						}
						afterEatingFlag = false;
						visited[row][column] = true;
					}
				}
				row += rowChange;
				column += colChange;
			}
		}
		return allDestinations;
	}

	toString() {
		if (this.getColor() === Color.BLACK) return "🟥";
		return "⬜️";
	}
}

export default Queen;
