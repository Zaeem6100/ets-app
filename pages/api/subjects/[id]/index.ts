import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

type Data = {
  id: number,
  name: string,
}

async function updateSubject(req: NextApiRequest, res: NextApiResponse<Data>) {
  const subject = await prisma.subject.update({
    where: {id: parseInt(req.query.id as string)},
    data: {name: req.body.name}
  });
  return res.status(200).json(subject);
}

async function deleteSubject(req: NextApiRequest, res: NextApiResponse<Data>) {
  const subject = await prisma.subject.delete({where: {id: parseInt(req.query.id as string)}});
  return res.status(200).json(subject);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "PUT":
      return updateSubject(req, res);
    case "DELETE":
      return deleteSubject(req, res);
  }
}