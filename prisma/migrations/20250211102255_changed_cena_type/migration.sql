/*
  Warnings:

  - You are about to alter the column `cena` on the `Storitve` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Storitve" ALTER COLUMN "cena" SET DATA TYPE INTEGER;
