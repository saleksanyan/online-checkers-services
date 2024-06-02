import Position from "./Position";

class Move {
	private start: Position;
	private dest: Position;

	constructor(startPosition: Position, endPosition: Position) {
		this.start = startPosition;
		this.dest = endPosition;
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
