-- DropForeignKey
ALTER TABLE "Anomaly" DROP CONSTRAINT "Anomaly_studentexamId_fkey";

-- AddForeignKey
ALTER TABLE "Anomaly" ADD CONSTRAINT "Anomaly_studentexamId_fkey" FOREIGN KEY ("studentexamId") REFERENCES "StudentExam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
