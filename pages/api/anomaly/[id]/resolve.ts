import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await prisma.anomaly.delete({where: {id: parseInt(req.query.id as string)}});
  return res.status(200).json({});
}
