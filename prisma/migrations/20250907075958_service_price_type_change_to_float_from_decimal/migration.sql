/*
  Warnings:

  - You are about to alter the column `servicePrice` on the `Services` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "public"."Services" ALTER COLUMN "servicePrice" SET DATA TYPE DOUBLE PRECISION;
