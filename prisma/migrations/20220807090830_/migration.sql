/*
  Warnings:

  - The primary key for the `Anomaly` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `Anomaly` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Anomaly" DROP CONSTRAINT "Anomaly_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Anomaly_pkey" PRIMARY KEY ("id");
