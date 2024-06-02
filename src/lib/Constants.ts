export enum Color {
	WHITE = "w",
	BLACK = "b",
	EMPTY_PLACE = " ",
}

export enum BoardConstants {
	COLUMNS = 8,
	ROWS = 8,
	MOVE_LENGTH = 4,
	HISTORY_CHECK_LENGTH = 12,
	PAWN_COUNT = 12
}

export class Constants {
    public static readonly Color = Color;
    public static readonly BoardConstants = BoardConstants;

    public static readonly LETTERS_TO_COLUMNS: { [key: string]: number } = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7
    };

    public static readonly COLUMNS_TO_LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];
}

export default Constants;
