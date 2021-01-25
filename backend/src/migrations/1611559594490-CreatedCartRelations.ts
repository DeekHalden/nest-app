import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatedCartRelations1611559594490 implements MigrationInterface {
    name = 'CreatedCartRelations1611559594490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "cart_status_enum" AS ENUM('ordered', 'rejected', 'rejected_by_client', 'partialy_rejected', 'ready_to_deliver', 'sent', 'delivered')`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "status" "cart_status_enum" NOT NULL DEFAULT 'ordered', "userId" integer, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "order_status_enum" AS ENUM('ordered', 'rejected', 'rejected_by_client', 'partialy_rejected', 'ready_to_deliver', 'delivered')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "status" "order_status_enum" NOT NULL DEFAULT 'ordered', "userId" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "order_status_enum"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TYPE "cart_status_enum"`);
    }

}
