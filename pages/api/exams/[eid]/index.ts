import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";
import {verifyAuth} from "../../../../lib/authServer";
import {JWTPayload} from "jose";

async function updateExam(req: NextApiRequest, res: NextApiResponse) {
  const exam = await prisma.exam.update({
    where: {id: parseInt(req.query.eid as string)},
    data: {
      name: req.body.name,
      Subject: {
        connect: {id: req.body.subjectId}
      },
      examEnd: req.body.examEnd,
      examStart: req.body.examStart,
      amountDifficulty1: req.body.amountDifficulty1,
      amountDifficulty2: req.body.amountDifficulty2,
      amountDifficulty3: req.body.amountDifficulty3,
      amountDifficulty4: req.body.amountDifficulty4,
      amountDifficulty5: req.body.amountDifficulty5,
    }
  });

  return res.status(200).json(exam);
}

async function deleteExam(req: NextApiRequest, res: NextApiResponse) {
  await prisma.exam.delete({where: {id: parseInt(req.query.eid as string)}});
  return res.status(200).json({});
}

async function getExamQuestions(req: NextApiRequest, res: NextApiResponse) {
  const payload = await verifyAuth(req, res) as JWTPayload;
  const studentExam = await prisma.studentExam.findFirst({
    where: {
      AND: [
        {studentId: payload['cnic'] as string},
        {examId: parseInt(req.query.eid as string)}
      ]
    },
    include: {
      Exam: true,
      ComputedQuestion: {
        include: {Question: true}
      },
    }
  });

  if (!studentExam) return res.status(404).json({});

  return res.status(200).json(studentExam);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getExamQuestions(req, res);
    case 'PUT':
      return updateExam(req, res);
    case 'DELETE':
      return deleteExam(req, res);
  }
}
