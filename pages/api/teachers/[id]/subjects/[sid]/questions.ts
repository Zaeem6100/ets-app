import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../../../lib/db";

async function getQuestions(req: NextApiRequest, res: NextApiResponse) {
  const teacher = await prisma.teacher.findUnique({
    where: {id: req.query.id as string},
    include: {
      Question: {
        where: {
          subjectId: parseInt(req.query.sid as string)
        }
      }
    }
  });
  return res.status(200).json(teacher?.Question);
}

async function addQuestion(req: NextApiRequest, res: NextApiResponse) {
  const question = await prisma.question.create({
    data: {
      statement: req.body.statement,
      answer: req.body.answer,
      difficulty: req.body.difficulty,
      op1: req.body.op1,
      op2: req.body.op2,
      op3: req.body.op3,
      op4: req.body.op4,
      subjectId: parseInt(req.query.sid as string),
      teacherId: req.query.id as string,
    }
  });

  return res.status(200).json(question);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getQuestions(req, res);
    case "POST":
      return addQuestion(req, res);
  }
}