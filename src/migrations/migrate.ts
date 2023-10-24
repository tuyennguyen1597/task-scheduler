import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1698018544391 implements MigrationInterface {
    name = 'Migrate1698018544391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_type_enum" AS ENUM('break', 'work')`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "account_id" integer NOT NULL, "start_time" TIMESTAMP NOT NULL, "duration" integer NOT NULL, "type" "public"."task_type_enum" NOT NULL DEFAULT 'work', "scheduler_id" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "account_id" integer NOT NULL, "agent_id" integer NOT NULL, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, "end_time" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_a66645f3ff90b44b9f202ab4179" FOREIGN KEY ("scheduler_id") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_a66645f3ff90b44b9f202ab4179"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TYPE "public"."task_type_enum"`);
    }

}
