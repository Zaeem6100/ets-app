/*
  Warnings:

  - Added the required column `ammountDifficulty1` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ammountDifficulty2` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ammountDifficulty3` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ammountDifficulty4` to the `Exam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ammountDifficulty5` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "ammountDifficulty1" INTEGER NOT NULL,
ADD COLUMN     "ammountDifficulty2" INTEGER NOT NULL,
ADD COLUMN     "ammountDifficulty3" INTEGER NOT NULL,
ADD COLUMN     "ammountDifficulty4" INTEGER NOT NULL,
ADD COLUMN     "ammountDifficulty5" INTEGER NOT NULL;
