/*
  Warnings:

  - You are about to drop the column `ammountDifficulty1` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `ammountDifficulty2` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `ammountDifficulty3` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `ammountDifficulty4` on the `Exam` table. All the data in the column will be lost.
  - You are about to drop the column `ammountDifficulty5` on the `Exam` table. All the data in the column will be lost.
  - Added the required column `amountDifficulty1` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountDifficulty2` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountDifficulty3` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountDifficulty4` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amountDifficulty5` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" DROP COLUMN "ammountDifficulty1",
DROP COLUMN "ammountDifficulty2",
DROP COLUMN "ammountDifficulty3",
DROP COLUMN "ammountDifficulty4",
DROP COLUMN "ammountDifficulty5",
ADD COLUMN     "amountDifficulty1" INTEGER NOT NULL,
ADD COLUMN     "amountDifficulty2" INTEGER NOT NULL,
ADD COLUMN     "amountDifficulty3" INTEGER NOT NULL,
ADD COLUMN     "amountDifficulty4" INTEGER NOT NULL,
ADD COLUMN     "amountDifficulty5" INTEGER NOT NULL;
