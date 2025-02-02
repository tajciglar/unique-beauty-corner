-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Termin" (
    "terminId" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "naVoljo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Termin_pkey" PRIMARY KEY ("terminId")
);

-- CreateTable
CREATE TABLE "Naročila" (
    "naročiloId" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT NOT NULL,
    "storitve" TEXT[],
    "cena" INTEGER NOT NULL,
    "terminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Naročila_pkey" PRIMARY KEY ("naročiloId")
);

-- AddForeignKey
ALTER TABLE "Naročila" ADD CONSTRAINT "Naročila_terminId_fkey" FOREIGN KEY ("terminId") REFERENCES "Termin"("terminId") ON DELETE RESTRICT ON UPDATE CASCADE;
