/*
  Warnings:

  - The `markedAnswer` column on the `ComputedQuestion` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[studentExamId,questionId]` on the table `ComputedQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[examId,studentId]` on the table `StudentExam` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `answer` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ComputedQuestion" DROP COLUMN "markedAnswer",
ADD COLUMN     "markedAnswer" INTEGER;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answer",
ADD COLUMN     "answer" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ComputedQuestion_studentExamId_questionId_key" ON "ComputedQuestion"("studentExamId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentExam_examId_studentId_key" ON "StudentExam"("examId", "studentId");
