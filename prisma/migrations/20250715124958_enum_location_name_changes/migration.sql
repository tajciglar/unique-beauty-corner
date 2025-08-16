/*
  Warnings:

  - The values [DOMŽALE,LJUBLJANA] on the enum `Location` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Location_new" AS ENUM ('Domžale', 'Ljubljana');
ALTER TABLE "Appointment" ALTER COLUMN "location" DROP DEFAULT;
ALTER TABLE "Appointment" ALTER COLUMN "location" TYPE "Location_new" USING ("location"::text::"Location_new");
ALTER TYPE "Location" RENAME TO "Location_old";
ALTER TYPE "Location_new" RENAME TO "Location";
DROP TYPE "Location_old";
ALTER TABLE "Appointment" ALTER COLUMN "location" SET DEFAULT 'Domžale';
COMMIT;

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "location" SET DEFAULT 'Domžale';
