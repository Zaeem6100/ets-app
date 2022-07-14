/*
  Warnings:

  - A unique constraint covering the columns `[subjectId,teacherId]` on the table `TeacherSubject` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeacherSubject_subjectId_teacherId_key" ON "TeacherSubject"("subjectId", "teacherId");
