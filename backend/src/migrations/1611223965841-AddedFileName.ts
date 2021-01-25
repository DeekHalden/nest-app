import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedFileName1611223965841 implements MigrationInterface {
    name = 'AddedFileName1611223965841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "name"`);
    }

}
