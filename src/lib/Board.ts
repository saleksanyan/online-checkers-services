import Figure from './Figure';
import HelpingFunctions from './HelpingFunctions';
import History from './History';
import Constants, { BoardConstants, Color } from './Constants';
import Pawn from './Pawn';
import Queen from './Queen';

class Board {
	private matrix: (Figure | Color.EMPTY_PLACE)[][];
	private blackCounter: number;
	private whiteCounter: number;
	private history: History;
	private whosTurn: Color.BLACK | Color.WHITE;

	constructor() {
		this.matrix = new Array(BoardConstants.ROWS).fill(Color.EMPTY_PLACE).map(() => new Array(BoardConstants.COLUMNS));
		this.history = new History();
		HelpingFunctions.constructBoard(this.matrix);
		this.whosTurn = Color.WHITE;
		this.blackCounter = BoardConstants.PAWN_COUNT;
		this.whiteCounter = BoardConstants.PAWN_COUNT;
	}
	// toJSON() {
	//     return {
	//         matrix: this.matrix.map(row => row.map(cell =>
	//             cell !== Color.EMPTY_PLACE && cell instanceof Figure ? cell.serialize() : cell
	//         )),
	//         blackCounter: this.blackCounter,
	//         whiteCounter: this.whiteCounter,
	//         history: this.history.toJSON(),
	//         whosTurn: this.whosTurn
	//     };
	// }

	toJSON() {
		let serializedMatrix = [];
		for (let i = 0; i < this.matrix.length; i++) {
			let row = this.matrix[i];
			let serializedRow = [];
			for (let j = 0; j < row.length; j++) {
				let cell = row[j];
				if (cell !== Color.EMPTY_PLACE) {
					serializedRow.push(cell.toJSON());
				} else {
					serializedRow.push(cell);
				}
			}
			serializedMatrix.push(serializedRow);
		}

		return {
			__class: this.constructor.name,
			matrix: serializedMatrix,
			blackCounter: this.blackCounter,
			whiteCounter: this.whiteCounter,
			history: this.history.toJSON(),
			whosTurn: this.whosTurn,
		};
	}

	static fromJSON(json: any) {
		const board = new Board();
		board.matrix = json.matrix.map((row: any) =>
			row.map((cell: any) => {
				if (cell !== Color.EMPTY_PLACE && cell != undefined) {
					if (cell.__class == 'Pawn') {
						return Pawn.fromJSON(cell);
					} else {
						return Queen.fromJSON(cell);
					}
				}
				return Color.EMPTY_PLACE;
			}),
		);
		board.blackCounter = json.blackCounter;
		board.whiteCounter = json.whiteCounter;
		board.history = History.fromJSON(json.history);
		board.whosTurn = json.whosTurn;
		return board;
	}

	decrementWhiteCounter() {
		this.whiteCounter--;
	}

	decrementBlackCounter() {
		this.blackCounter--;
	}

	getWhiteCounter(): number {
		return this.whiteCounter;
	}

	getBlackCounter(): number {
		return this.blackCounter;
	}

	getWhosTurn(): Color {
		return this.whosTurn;
	}

	getBoard(): (Figure | Color.EMPTY_PLACE)[][] {
		return this.matrix;
	}

	getHistory(): History {
		return this.history;
	}

	setWhiteCount(count: number) {
		this.whiteCounter = count;
	}

	setBlackCount(count: number) {
		this.blackCounter = count;
	}

	setBoard(newBoard: (Figure | Color.EMPTY_PLACE)[][]) {
		this.matrix = newBoard;
	}

	setHistory(history: History) {
		this.history = history;
	}

	changeTurn() {
		this.whosTurn = this.whosTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
	}

	DoesGameEnd(): boolean {
		return this.blackCounter === 0 || this.whiteCounter === 0;
	}

	toString() {
		let board = '\n';
		for (let index = 0; index < BoardConstants.COLUMNS * 6 - 4; index++) {
			board += '_';
		}
		board += '\n';
		for (let row = 0; row < this.matrix.length; row++) {
			let rowNumber = BoardConstants.ROWS - row;
			board += ' ' + rowNumber + ' | ';

			for (let column = 0; column < this.matrix.length; column++) {
				if (this.matrix[row][column] === ' ') {
					board += '  ' + ' | ';
				} else {
					board += this.matrix[row][column] + ' | ';
				}
			}

			board += '\n';
			for (let index = 0; index < BoardConstants.COLUMNS * 6 - 4; index++) {
				board += '_';
			}
			board += '\n';
		}
		board += '     ';
		let letters = Constants.COLUMNS_TO_LETTERS;
		for (let index = 0; index < BoardConstants.COLUMNS; index++) {
			board += letters[index].toUpperCase() + '    ';
		}
		board += '\n';
		return board;
	}
}

export default Board;
