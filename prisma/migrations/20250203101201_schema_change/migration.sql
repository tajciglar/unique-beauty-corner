/*
  Warnings:

  - You are about to drop the column `storitve` on the `Naročila` table. All the data in the column will be lost.
  - Added the required column `storitveId` to the `Naročila` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Naročila" DROP COLUMN "storitve",
ADD COLUMN     "storitveId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "KategorijaStoritev" (
    "id" SERIAL NOT NULL,
    "naslovKategorije" TEXT NOT NULL,

    CONSTRAINT "KategorijaStoritev_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storitve" (
    "idStoritve" SERIAL NOT NULL,
    "imeStoritve" TEXT NOT NULL,
    "cena" DECIMAL(65,30) NOT NULL,
    "časStoritve" INTEGER,
    "kategorijaStoritevId" INTEGER NOT NULL,
    "naročilaNaročiloId" INTEGER,

    CONSTRAINT "Storitve_pkey" PRIMARY KEY ("idStoritve")
);

-- CreateIndex
CREATE UNIQUE INDEX "KategorijaStoritev_naslovKategorije_key" ON "KategorijaStoritev"("naslovKategorije");

-- AddForeignKey
ALTER TABLE "Storitve" ADD CONSTRAINT "Storitve_kategorijaStoritevId_fkey" FOREIGN KEY ("kategorijaStoritevId") REFERENCES "KategorijaStoritev"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storitve" ADD CONSTRAINT "Storitve_naročilaNaročiloId_fkey" FOREIGN KEY ("naročilaNaročiloId") REFERENCES "Naročila"("naročiloId") ON DELETE SET NULL ON UPDATE CASCADE;
