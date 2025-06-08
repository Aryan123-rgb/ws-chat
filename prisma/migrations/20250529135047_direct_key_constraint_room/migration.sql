/*
  Warnings:

  - A unique constraint covering the columns `[directKey]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "directKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Room_directKey_key" ON "Room"("directKey");
