import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";

type Subject = {
  id: number,
  name: string,
  _count?: {
    TeacherSubject: number,
    Question: number,
  }
}

async function getSubjects(req: NextApiRequest, res: NextApiResponse<Subject[]>) {
  const subjects: Subject[] = await prisma.subject.findMany({
    include: {
      _count: {
        select: {
          TeacherSubject: true,
          Question: true,
        }
      }
    }
  });
  return res.status(200).json(subjects);
}

async function createSubject(req: NextApiRequest, res: NextApiResponse<Subject>) {
  const subject: Subject = await prisma.subject.create({data: {name: req.body.name,}});
  return res.status(200).json(subject);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getSubjects(req, res);
    case "POST":
      return createSubject(req, res);
  }
}