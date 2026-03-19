-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Services" ALTER COLUMN "servicePrice" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Appointment_date_available_idx" ON "Appointment"("date", "available");

-- CreateIndex
CREATE INDEX "Appointment_date_startTime_idx" ON "Appointment"("date", "startTime");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
