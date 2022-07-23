import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await prisma.exam.update({
    where: {id: parseInt(req.query.eid as string)},
    data: {status: "published"}
  });

  return res.status(200);
}
