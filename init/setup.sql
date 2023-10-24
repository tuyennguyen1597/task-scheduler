-- Try to create the database (this may fail if it already exists)
CREATE DATABASE "leonardo1";

-- Handle the case if the database already exists (ignore the error)
DO $$ 
BEGIN
  BEGIN
    -- Check if the database "leonardo1" exists (if it doesn't, an error will be raised)
    PERFORM 1 FROM pg_database WHERE datname = 'leonardo';
  EXCEPTION WHEN others THEN
    -- Error is raised, but we can ignore it since we're checking existence
  END;
END $$;

-- Create an ENUM type "task_type_enum"
CREATE TYPE "public"."task_type_enum" AS ENUM('break', 'work');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the "task" table
CREATE TABLE "task" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "account_id" integer NOT NULL,
  "start_time" TIMESTAMP NOT NULL,
  "duration" integer NOT NULL,
  "type" "public"."task_type_enum" NOT NULL DEFAULT 'work',
  "scheduler_id" uuid,
  CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
);

-- Create the "schedule" table
CREATE TABLE "schedule" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  "account_id" integer NOT NULL,
  "agent_id" integer NOT NULL,
  "start_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_time" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id")
);

-- Add a foreign key constraint to the "scheduler_id" column in the "task" table
ALTER TABLE "task" ADD CONSTRAINT "FK_a66645f3ff90b44b9f202ab4179" FOREIGN KEY ("scheduler_id") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
