/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `GPUInfo` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `GPUReference` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `RAMInfo` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `RAMReference` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `boardInfo` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `boardReference` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `deviceId` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `perocessorInfo` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `processorReference` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `storageInfo` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `storageReference` on the `Device` table. All the data in the column will be lost.
  - The primary key for the `Loan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `arrivalLocation` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `loanId` on the `Loan` table. All the data in the column will be lost.
  - You are about to drop the column `originLocation` on the `Loan` table. All the data in the column will be lost.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ticketId` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `brand` to the `Device` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Device` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `arrivalCityId` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Loan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `originCityId` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Peripheral` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - The required column `id` was added to the `Ticket` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `state` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Enum_ComponentType" AS ENUM ('RAM', 'PROCESSOR', 'GPU', 'BOARD', 'STORAGE');

-- CreateEnum
CREATE TYPE "Enum_LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXTENDED', 'FINISHED');

-- CreateEnum
CREATE TYPE "Enum_PeripheralType" AS ENUM ('MOUSE', 'KEYBOARD', 'MONITOR', 'HEADSET', 'WEBCAM', 'OTHER');

-- CreateEnum
CREATE TYPE "Enum_TicketState" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- DropForeignKey
ALTER TABLE "LoanDevice" DROP CONSTRAINT "LoanDevice_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "LoanDevice" DROP CONSTRAINT "LoanDevice_loanId_fkey";

-- DropForeignKey
ALTER TABLE "LoanPeripheral" DROP CONSTRAINT "LoanPeripheral_loanId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_loanId_fkey";

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
DROP COLUMN "GPUInfo",
DROP COLUMN "GPUReference",
DROP COLUMN "RAMInfo",
DROP COLUMN "RAMReference",
DROP COLUMN "boardInfo",
DROP COLUMN "boardReference",
DROP COLUMN "deviceId",
DROP COLUMN "perocessorInfo",
DROP COLUMN "processorReference",
DROP COLUMN "storageInfo",
DROP COLUMN "storageReference",
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Loan" DROP CONSTRAINT "Loan_pkey",
DROP COLUMN "arrivalLocation",
DROP COLUMN "loanId",
DROP COLUMN "originLocation",
ADD COLUMN     "arrivalCityId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "originCityId" TEXT NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "Enum_LoanStatus" NOT NULL,
ADD CONSTRAINT "Loan_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Peripheral" ADD COLUMN     "removed" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "type",
ADD COLUMN     "type" "Enum_PeripheralType" NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_pkey",
DROP COLUMN "ticketId",
ADD COLUMN     "id" TEXT NOT NULL,
DROP COLUMN "state",
ADD COLUMN     "state" "Enum_TicketState" NOT NULL,
ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roleId" SET DEFAULT '1';

-- DropEnum
DROP TYPE "Enum_State";

-- DropEnum
DROP TYPE "Enum_Type";

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" "Enum_ComponentType" NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceComponent" (
    "deviceId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceComponent_pkey" PRIMARY KEY ("deviceId","componentId")
);

-- CreateTable
CREATE TABLE "city" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DeviceComponent" ADD CONSTRAINT "DeviceComponent_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceComponent" ADD CONSTRAINT "DeviceComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_originCityId_fkey" FOREIGN KEY ("originCityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan" ADD CONSTRAINT "Loan_arrivalCityId_fkey" FOREIGN KEY ("arrivalCityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanPeripheral" ADD CONSTRAINT "LoanPeripheral_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanDevice" ADD CONSTRAINT "LoanDevice_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanDevice" ADD CONSTRAINT "LoanDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
