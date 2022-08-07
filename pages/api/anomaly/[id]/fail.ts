import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const anomaly = await prisma.anomaly.update({where: {id: parseInt(req.query.id as string)}});
  await prisma.studentExam.update({where: {id: anomaly.studentexamId}, data: {score: 0}});
  await prisma.anomaly.deleteMany({where: {studentexamId: anomaly.studentexamId}});

  return res.status(200).json({});
}
