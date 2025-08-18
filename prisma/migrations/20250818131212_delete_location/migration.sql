/*
  Warnings:

  - You are about to drop the column `location` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "location";

-- DropEnum
DROP TYPE "public"."Location";
