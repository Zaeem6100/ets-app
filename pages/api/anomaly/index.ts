import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";

async function getAllAnomalies(req: NextApiRequest, res: NextApiResponse) {
  const anomalies = await prisma.anomaly.findMany({
    include: {
      Student: {
        include: {
          User: true,
        }
      },
      StudentExam: {
        include: {
          Exam: true,
        }
      }
    }
  });

  const data = anomalies.map((anomaly) => {
    anomaly.imagePath = `/api/images/${anomaly.imagePath.split('/').pop()}`;
    return anomaly;
  })

  return res.status(200).json(data);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await getAllAnomalies(req, res);
    default:
      return res.status(405).json({});
  }
}