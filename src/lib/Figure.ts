import Position from "./Position";
import Board from "./Board";
import HelpingFunctions from "./HelpingFunctions";
import Move from "./Move";
import { Color } from "./Constants";

abstract class Figure {
	protected color: Color;
	protected currentPosition: Position;

	constructor(color: Color, position: Position) {
		this.color = color;
		this.currentPosition = position;
	}

	getColor() {
		return this.color;
	}

	hasOppositeColor(otherFigure: Figure) {
		return this.color !== otherFigure.color;
	}

	setPosition(position: Position) {
		this.currentPosition = position;
	}

	getCurrentPosition() {
		return this.currentPosition;
	}

	abstract reachablePositions(board: Board, moves: Move[]): Position[];

	move(position: Position, reachablePositions: Position[], moves: Move[], board: Board): boolean {
		if (!HelpingFunctions.isReachablePosition(position, reachablePositions)) {
			return false;
		}
		let boardHistory = board.getHistory();
		boardHistory.addBoardHistory(HelpingFunctions.deepCopyMatrix(board.getBoard()));
		let path = HelpingFunctions.findPath(moves, position, this.currentPosition);
		let move: Move;
		for (let positionIndex = 0; positionIndex < path.length; positionIndex++) {
			move = path[positionIndex];
			let row = move.getStart().getRow();
			let column = move.getStart().getColumn();
			let newRow = move.getDest().getRow();
			let newColumn = move.getDest().getColumn();
			let startPos = move.getStart();
			let destPos = move.getDest();

			HelpingFunctions.deleteAllfiguresBetweenGivenPositions(startPos, destPos, board);
			HelpingFunctions.swap(newRow, newColumn, row, column, board);
		}
		let figure = board.getBoard()[position.getRow()][position.getColumn()];
		if (figure instanceof Figure) {
			boardHistory.addStepHistory(new Move(this.currentPosition, position), board.getWhosTurn());
			this.setPosition(position);
		}
		return true;
	}
}

export default Figure;
