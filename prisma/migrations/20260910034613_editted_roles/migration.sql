/*
  Warnings:

  - The values [USER] on the enum `RoleEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoleEnum_new" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');
ALTER TABLE "roles" ALTER COLUMN "name" TYPE "RoleEnum_new" USING ("name"::text::"RoleEnum_new");
ALTER TYPE "RoleEnum" RENAME TO "RoleEnum_old";
ALTER TYPE "RoleEnum_new" RENAME TO "RoleEnum";
DROP TYPE "public"."RoleEnum_old";
COMMIT;
