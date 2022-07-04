import {MigrationInterface, QueryRunner} from "typeorm";

export class History1656971893296 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
        CREATE TABLE history (
            id serial PRIMARY KEY,
            display_id uuid NOT NULL DEFAULT uuid_generate_v4(),
            search text NOT NULL,
            provider text NOT NULL,
            response json NULL default NULL,
            created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            deleted_at TIMESTAMP WITH TIME ZONE
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE history`);
    }

}
