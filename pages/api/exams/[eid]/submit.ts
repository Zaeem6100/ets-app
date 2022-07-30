import {NextApiRequest, NextApiResponse} from "next";
import {verifyAuth} from "../../../../lib/authServer";
import {JWTPayload} from "jose";
import {prisma} from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = await verifyAuth(req, res) as JWTPayload;
  const answers = req.body.answers;

  const studentExam = await prisma.studentExam.findFirst({
    where: {
      AND: [
        {studentId: payload['cnic'] as string},
        {examId: parseInt(req.query.eid as string)}
      ]
    },
    include: {
      ComputedQuestion: {
        include: {Question: true}
      },
    }
  });

  if (!studentExam) return res.status(404).json({});

  let score = 0;
  for (const answer of answers) {
    let cq = studentExam.ComputedQuestion.find((cQuestion) => cQuestion.id === answer.qid);
    if (!cq) continue;
    if (cq.Question.answer === answer.answer) score++;
    await prisma.computedQuestion.update({
      where: {id: cq.id},
      data: {markedAnswer: answer.answer},
    })
  }

  await prisma.studentExam.update({
    where: {id: studentExam.id},
    data: {score}
  })

  return res.status(200).json({});
}
