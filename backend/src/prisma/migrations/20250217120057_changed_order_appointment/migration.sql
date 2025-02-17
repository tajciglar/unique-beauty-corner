/*
  Warnings:

  - A unique constraint covering the columns `[appointmentId]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "ordersId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Orders_appointmentId_key" ON "Orders"("appointmentId");
