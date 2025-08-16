/*
  Warnings:

  - You are about to drop the column `date` on the `Termin` table. All the data in the column will be lost.
  - Added the required column `datum` to the `Termin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Termin" DROP COLUMN "date",
ADD COLUMN     "datum" TEXT NOT NULL;
