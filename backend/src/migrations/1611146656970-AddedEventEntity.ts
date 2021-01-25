import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedEventEntity1611146656970 implements MigrationInterface {
  name = 'AddedEventEntity1611146656970';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "event" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "event" ADD "payload" json NOT NULL`);
    await queryRunner.query(
      `CREATE INDEX "IDX_b535fbe8ec6d832dde22065ebd" ON "event" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6e1de41532ad6af403d3ceb4f2" ON "event" ("name", "type") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_6e1de41532ad6af403d3ceb4f2"`);
    await queryRunner.query(`DROP INDEX "IDX_b535fbe8ec6d832dde22065ebd"`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "payload"`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614"`,
    );
    await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "id"`);
  }
}
