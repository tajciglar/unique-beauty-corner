/*
  Warnings:

  - You are about to drop the column `ordersId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `OrdersId` on the `Services` table. All the data in the column will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Services" DROP CONSTRAINT "Services_OrdersId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "ordersId";

-- AlterTable
ALTER TABLE "Services" DROP COLUMN "OrdersId",
ADD COLUMN     "OrderId" INTEGER;

-- DropTable
DROP TABLE "Orders";

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_appointmentId_key" ON "Order"("appointmentId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_OrderId_fkey" FOREIGN KEY ("OrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
