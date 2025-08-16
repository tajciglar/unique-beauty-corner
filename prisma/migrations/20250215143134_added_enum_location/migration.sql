-- CreateEnum
CREATE TYPE "Lokacija" AS ENUM ('DOMŽALE', 'LJUBLJANA');

-- AlterTable
ALTER TABLE "Termin" ADD COLUMN     "lokacija" "Lokacija" NOT NULL DEFAULT 'DOMŽALE';
