import Position from './Position';

class Move {
	private start: Position;
	private dest: Position;

	constructor(startPosition: Position, endPosition: Position) {
		this.start = startPosition;
		this.dest = endPosition;
	}

	toJSON() {
        return {
            __class: this.constructor.name,
            start: this.start.toJSON(),
            dest: this.dest.toJSON(),
        };
    }

    static fromJSON(json: any): Move {
        return new Move(Position.fromJSON(json.start), Position.fromJSON(json.dest));
    }

	getStart() {
		return this.start;
	}

	getDest() {
		return this.dest;
	}

	setDest(newDest: Position) {
		this.dest.setRow(newDest.getRow());
		this.dest.setColumn(newDest.getColumn());
	}

	setStart(newStart: Position) {
		this.start.setRow(newStart.getRow());
		this.start.setColumn(newStart.getColumn());
	}
	toString() {
		return `${this.start}${this.dest}`;
	}
}
export default Move;
