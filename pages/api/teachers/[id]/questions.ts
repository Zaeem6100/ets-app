import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

async function getQuestions(req: NextApiRequest, res: NextApiResponse) {
  const teacher = await prisma.teacher.findUnique({
    where: {id: req.query.id as string},
    include: {Question: true}
  });
  return res.status(200).json(teacher?.Question);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getQuestions(req, res);
  }
}