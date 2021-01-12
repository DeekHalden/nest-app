import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDbSeed1610437681400 implements MigrationInterface {
  name = 'InitialDbSeed1610437681400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "title" "role_title_enum" NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reset_password" ("id" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "verify" ("id" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c554da021aecbe3860c4b631be5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO role (title) VALUES ('admin'), ('manager'), ('courier'), ('customer')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`);
    await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`);
    await queryRunner.query(`DROP TABLE "user_roles_role"`);
    await queryRunner.query(`DROP TABLE "verify"`);
    await queryRunner.query(`DROP TABLE "reset_password"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
