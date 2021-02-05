import {MigrationInterface, QueryRunner} from "typeorm";

export class FieldFIx1611582320386 implements MigrationInterface {
    name = 'FieldFIx1611582320386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_68e9e65ec5abeaf8fee36007219"`);
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME COLUMN "productid" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"`);
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME COLUMN "productId" TO "productid"`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_68e9e65ec5abeaf8fee36007219" FOREIGN KEY ("productid") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
