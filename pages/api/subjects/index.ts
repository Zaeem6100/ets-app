import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";

type Data = {
  id: number,
  name: string,
  questionCount: number,
  teacherCount: number,
}

async function getSubjects(req: NextApiRequest, res: NextApiResponse<Data>) {
  const subjects = await prisma.subject.findMany();
  return res.status(200).json(subjects);
}

async function createSubject(req: NextApiRequest, res: NextApiResponse<Data>) {
  const subject = await prisma.subject.create({data: {name: req.body.name,}});
  return res.status(200).json(subject);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getSubjects(req, res);
    case "POST":
      return createSubject(req, res);
  }
}