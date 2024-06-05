import { Color } from './Constants';
import Figure from './Figure';
import Move from './Move';

class History {
	
	private boardHistory: (Figure | Color.EMPTY_PLACE)[][][];
	private size = 0;

	private steps: { [move: string]: string }[];

	constructor() {
		this.boardHistory = [];
		this.steps = [];
	}

	static fromJSON(json: any): History {
        const history = new History();
        history.boardHistory = json.boardHistory.map((snapshot: any) =>
            snapshot.map((row: any) => row.map((cell: any) => 
               { if(cell != undefined && cell.__class != undefined) {return cell.fromJSON(cell)}
				else {return cell}
			   }
            ))
        );
        history.size = json.size;
        history.steps = json.steps;
        return history;
    }

    toJSON() {
        return {
            boardHistory: this.boardHistory.map(snapshot =>
                snapshot.map(row => row.map(cell => cell instanceof Figure ? cell.toJSON() : cell))
            ),
            size: this.size,
            steps: this.steps,
        };
    }

	getBoardHistory() {
		return this.boardHistory;
	}

	getSteps() {
		return this.steps;
	}

	changeBoard(indexFromBoardHistroy: number): (Figure | Color.EMPTY_PLACE)[][] {
		return this.boardHistory[indexFromBoardHistroy];
	}

	getByIndex(
		indexFromBoardHistroy: number,
	): (Figure | Color.EMPTY_PLACE)[][] | null {
		if (indexFromBoardHistroy >= this.size || indexFromBoardHistroy < 0) {
			return null;
		}
		let lastIndex = this.size - 1;
		while (lastIndex >= indexFromBoardHistroy) {
			lastIndex--;
			this.boardHistory.pop();
		}

		return this.boardHistory[indexFromBoardHistroy];
	}

	getSize(): number {
		return this.size;
	}

	addBoardHistory(board: (Figure | Color.EMPTY_PLACE)[][]) {
		this.size++;
		this.boardHistory.push(board);
	}

	addStepHistory(step: Move, playerColor: string) {
		this.steps.push({ [`${step}`]: playerColor });
	}

	setBoardHistory(boardHistory: (Figure | Color.EMPTY_PLACE)[][][]) {
		this.boardHistory = boardHistory;
	}

	setStepHistory(steps: { [move: string]: string }[]) {
		this.steps = steps;
	}
}

export default History;
