import {MigrationInterface, QueryRunner} from "typeorm";

export class TablesInitialization1611582140529 implements MigrationInterface {
    name = 'TablesInitialization1611582140529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "name" character varying, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "imageId" integer, CONSTRAINT "UQ_f7bf944ad9f1034110e8c2133ab" UNIQUE ("title"), CONSTRAINT "REL_b1b332c0f436897f21a960f26c" UNIQUE ("imageId"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "title" "role_title_enum" NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "cartid" integer, "productid" integer, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "name" character varying NOT NULL, "payload" json NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b535fbe8ec6d832dde22065ebd" ON "event" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_6e1de41532ad6af403d3ceb4f2" ON "event" ("name", "type") `);
        await queryRunner.query(`CREATE TABLE "reset_password" ("id" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_82bffbeb85c5b426956d004a8f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "verify" ("id" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c554da021aecbe3860c4b631be5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_images_file" ("productId" integer NOT NULL, "fileId" integer NOT NULL, CONSTRAINT "PK_d878e77f31198d8add91dfdbb78" PRIMARY KEY ("productId", "fileId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3841db663ef502a0a33e6b7cdf" ON "product_images_file" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_697f1706bb9245dee6f7694f12" ON "product_images_file" ("fileId") `);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_b1b332c0f436897f21a960f26c7" FOREIGN KEY ("imageId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_d06caed76b185be338a4d2c8e2c" FOREIGN KEY ("cartid") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_68e9e65ec5abeaf8fee36007219" FOREIGN KEY ("productid") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_images_file" ADD CONSTRAINT "FK_3841db663ef502a0a33e6b7cdf5" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images_file" ADD CONSTRAINT "FK_697f1706bb9245dee6f7694f12c" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`ALTER TABLE "product_images_file" DROP CONSTRAINT "FK_697f1706bb9245dee6f7694f12c"`);
        await queryRunner.query(`ALTER TABLE "product_images_file" DROP CONSTRAINT "FK_3841db663ef502a0a33e6b7cdf5"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_68e9e65ec5abeaf8fee36007219"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_d06caed76b185be338a4d2c8e2c"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_b1b332c0f436897f21a960f26c7"`);
        await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`);
        await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP INDEX "IDX_697f1706bb9245dee6f7694f12"`);
        await queryRunner.query(`DROP INDEX "IDX_3841db663ef502a0a33e6b7cdf"`);
        await queryRunner.query(`DROP TABLE "product_images_file"`);
        await queryRunner.query(`DROP TABLE "verify"`);
        await queryRunner.query(`DROP TABLE "reset_password"`);
        await queryRunner.query(`DROP INDEX "IDX_6e1de41532ad6af403d3ceb4f2"`);
        await queryRunner.query(`DROP INDEX "IDX_b535fbe8ec6d832dde22065ebd"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
