import {MigrationInterface, QueryRunner} from "typeorm";

export class RemovedUserNameFromUserEntity1611230069656 implements MigrationInterface {
    name = 'RemovedUserNameFromUserEntity1611230069656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
    }

}
