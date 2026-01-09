/*
  Warnings:

  - You are about to alter the column `price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `displayOrder` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ServiceCategory" ADD COLUMN     "categoryDescription" TEXT;

-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "displayOrder" INTEGER NOT NULL,
ADD COLUMN     "serviceDescription" TEXT;
