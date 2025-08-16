/*
  Warnings:

  - You are about to drop the `KategorijaStoritev` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Naročila` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Storitve` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Termin` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Location" AS ENUM ('DOMŽALE', 'LJUBLJANA');

-- DropForeignKey
ALTER TABLE "Naročila" DROP CONSTRAINT "Naročila_terminId_fkey";

-- DropForeignKey
ALTER TABLE "Storitve" DROP CONSTRAINT "Storitve_kategorijaStoritevId_fkey";

-- DropForeignKey
ALTER TABLE "Storitve" DROP CONSTRAINT "Storitve_naročilaNaročiloId_fkey";

-- DropTable
DROP TABLE "KategorijaStoritev";

-- DropTable
DROP TABLE "Naročila";

-- DropTable
DROP TABLE "Storitve";

-- DropTable
DROP TABLE "Termin";

-- DropEnum
DROP TYPE "Lokacija";

-- CreateTable
CREATE TABLE "Appointment" (
    "appointmentId" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "avaliable" BOOLEAN NOT NULL DEFAULT true,
    "location" "Location" NOT NULL DEFAULT 'DOMŽALE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("appointmentId")
);

-- CreateTable
CREATE TABLE "Orders" (
    "OrdersId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("OrdersId")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "serviceId" SERIAL NOT NULL,
    "serviceName" TEXT NOT NULL,
    "servicePrice" INTEGER NOT NULL,
    "serviceTime" INTEGER,
    "serviceCategoryId" INTEGER NOT NULL,
    "OrdersId" INTEGER,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("serviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_categoryName_key" ON "ServiceCategory"("categoryName");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("appointmentId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_OrdersId_fkey" FOREIGN KEY ("OrdersId") REFERENCES "Orders"("OrdersId") ON DELETE SET NULL ON UPDATE CASCADE;
