import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717400989504 implements MigrationInterface {
    name = 'Migration1717400989504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "history" (
                "id" SERIAL NOT NULL,
                "boardHistory" json NOT NULL,
                "steps" text NOT NULL,
                CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "board" (
                "id" SERIAL NOT NULL,
                "board" json NOT NULL,
                CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "game" (
                "id" SERIAL NOT NULL,
                "currentFigure" text,
                "reachablePositionsOfCurrentFigure" text,
                "moves" text NOT NULL,
                "boardId" integer,
                CONSTRAINT "REL_fa3977ef9150e1560382c65d0f" UNIQUE ("boardId"),
                CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "game"
            ADD CONSTRAINT "FK_fa3977ef9150e1560382c65d0f8" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "game" DROP CONSTRAINT "FK_fa3977ef9150e1560382c65d0f8"
        `);
        await queryRunner.query(`
            DROP TABLE "game"
        `);
        await queryRunner.query(`
            DROP TABLE "board"
        `);
        await queryRunner.query(`
            DROP TABLE "history"
        `);
    }

}
