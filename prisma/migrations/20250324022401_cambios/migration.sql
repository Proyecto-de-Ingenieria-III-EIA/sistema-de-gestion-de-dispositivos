/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Peripheral` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[loanId,deviceId,technicianId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `technicianId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Ticket_loanId_deviceId_key";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "technicianId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Peripheral_serialNumber_key" ON "Peripheral"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_loanId_deviceId_technicianId_key" ON "Ticket"("loanId", "deviceId", "technicianId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
