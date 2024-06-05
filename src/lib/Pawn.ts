import Figure from './Figure';
import Position from './Position';
import { Color } from './Constants';

import Board from './Board';
import Validations from './Validations';
import HelpingFunctions from './HelpingFunctions';
import Move from './Move';


class Pawn extends Figure {

	constructor(color: Color, currentPosition: Position) {
		super(color, currentPosition);
	}

	toJSON() {
		let obj = {
            __class: this.constructor.name,
            color: this.color,
            currentPosition: this.currentPosition.toJSON(),
        }
        return obj;
    }

	static fromJSON(json: any): Pawn {
        return new Pawn(json.color, Position.fromJSON(json.currentPosition));
    }

	reachablePositions(board: Board, moves: Move[]): Position[] {
		return this.allDestinations(this.currentPosition, board, false, [], moves);
	}

	allDestinations(
		position: Position,
		board: Board,
		afterEating: boolean,
		allDestinations: Position[],
		moves: Move[],
	): Position[] {
		let reachablePositionsWithoutEating = [1, -1];

		let reachablePositionsAfterEating = [2, -2];
		let row = position.getRow();
		let column = position.getColumn();

		for (
			let reachableRow = 0;
			reachableRow < reachablePositionsWithoutEating.length;
			reachableRow++
		) {
			for (
				let reachableColumn = 0;
				reachableColumn < reachablePositionsWithoutEating.length;
				reachableColumn++
			) {

				let eatableFigureRow =
					reachablePositionsWithoutEating[reachableRow] + row;
				let eatableFigureColumn =
					reachablePositionsWithoutEating[reachableColumn] + column;
				let figuresNewRow =
					reachablePositionsAfterEating[reachableRow] + row;
				let figuresNewColumn =
					reachablePositionsAfterEating[reachableColumn] + column;

				if (Validations.isValidPlace(eatableFigureRow, eatableFigureColumn)) {
					if (
						Validations.placeIsEmpty(
							eatableFigureRow,
							eatableFigureColumn,
							board,
						) &&
						!afterEating &&
						Validations.notStepBack(
							this.getColor(),
							eatableFigureRow,
							this.currentPosition,
						)
					) {
						HelpingFunctions.addingPositionToArray(
							eatableFigureRow,
							eatableFigureColumn,
							allDestinations,
						);
						moves.push(
							new Move(
								position,
								new Position(
									Position.getPositionUsingBoardPlaces(
										eatableFigureRow,
										eatableFigureColumn,
									),
								),
							),
						);
					} else if (
						!Validations.placeIsEmpty(
							eatableFigureRow,
							eatableFigureColumn,
							board,
						) &&
						Validations.isValidPlace(figuresNewRow, figuresNewColumn) &&
						Validations.placeIsEmpty(figuresNewRow, figuresNewColumn, board) &&
						HelpingFunctions.wasNotRepeatedStap(
							allDestinations,
							figuresNewRow,
							figuresNewColumn,
						)
					) {
						let figure =
							board.getBoard()[eatableFigureRow][eatableFigureColumn];

						if (
							figure instanceof Figure &&
							board.getWhosTurn() !== figure.getColor()
						) {
							let nextPos = HelpingFunctions.addingPositionToArray(
								figuresNewRow,
								figuresNewColumn,
								allDestinations,
							);
							moves.push(
								new Move(
									position,
									new Position(
										Position.getPositionUsingBoardPlaces(
											figuresNewRow,
											figuresNewColumn,
										),
									),
								),
							);

							this.allDestinations(
								nextPos,
								board,
								true,
								allDestinations,
								moves,
							);
						}
					}
				}
			}
		}

		return allDestinations;
	}

	toString() {
		if (this.getColor() === Color.BLACK) return '🔴';
		return '⚪';
	}
}

export default Pawn;
