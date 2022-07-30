import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";
import {verifyAuth} from "../../../lib/authServer";
import {JWTPayload} from "jose";

async function createExam(req: NextApiRequest, res: NextApiResponse) {
  const exam = await prisma.exam.create({
    data: {
      name: req.body.name,
      Subject: {
        connect: {id: parseInt(req.body.subjectId)}
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

async function getExams(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  if ('role' in tokenPayload) {
    switch (tokenPayload['role']) {
      case 'admin':
        const exams = await prisma.exam.findMany({include: {Subject: true}});
        return res.status(200).json(exams);
      case 'student':
        const studentExams = await prisma.studentExam.findMany({
          where: {studentId: tokenPayload['cnic'] as string},
          include: {
            Exam: {
              include: {Subject: true}
            },
            _count: {
              select: {ComputedQuestion: true}
            }
          }
        });
        return res.status(200).json(studentExams);
      default:
        return res.status(401).json({});
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getExams(req, res);
    case 'POST':
      return createExam(req, res);
  }
  return res.status(405).json({});
}
