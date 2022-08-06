import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

async function registerAnomaly(req: NextApiRequest, res: NextApiResponse) {
  const studentexamId = parseInt(req.body.seid as string);
  const imagePath = req.body.image as string;

  await prisma.student.update({
    where: {id: req.query.id as string},
    data: {Anomaly: {create: {studentexamId, imagePath}}}
  });

  return res.status(201).json({});
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return registerAnomaly(req, res);
    default:
      return res.status(405).json({});
  }
}
