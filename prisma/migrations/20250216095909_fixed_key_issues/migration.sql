/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `appointmentId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `avaliable` on the `Appointment` table. All the data in the column will be lost.
  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `OrdersId` on the `Orders` table. All the data in the column will be lost.
  - The primary key for the `Services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceId` on the `Services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_OrdersId_fkey";

-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_serviceId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
DROP COLUMN "appointmentId",
DROP COLUMN "avaliable",
ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pkey",
DROP COLUMN "OrdersId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Services" DROP CONSTRAINT "Services_pkey",
DROP COLUMN "serviceId",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "servicePrice" SET DATA TYPE DECIMAL(65,30),
ADD CONSTRAINT "Services_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_OrdersId_fkey" FOREIGN KEY ("OrdersId") REFERENCES "Orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
