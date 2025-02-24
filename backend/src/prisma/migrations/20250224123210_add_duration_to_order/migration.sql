/*
  Warnings:

  - Added the required column `duration` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "duration" INTEGER NOT NULL;
