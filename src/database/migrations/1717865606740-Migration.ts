import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1717865606740 implements MigrationInterface {
    name = 'Migration1717865606740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "player_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "gameID" character varying NOT NULL,
                "jwtPlayer" character varying NOT NULL,
                CONSTRAINT "PK_db4a0b692e54fd8ee0247f40d0d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "game_entity" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "game" json NOT NULL,
                "players" text NOT NULL,
                CONSTRAINT "PK_f9f8d5bc97d6a9fcb2058fbdfef" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "game_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "player_entity"
        `);
    }

}
