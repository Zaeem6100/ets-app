import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

async function getSubjects(req: NextApiRequest, res: NextApiResponse) {
  const teacher = await prisma.teacher.findUnique({
    where: {id: req.query.id as string},
    include: {
      TeacherSubject: {
        include: {Subject: true}
      }
    }
  });
  return res.status(200).json(teacher?.TeacherSubject);
}

async function updateSubjects(req: NextApiRequest, res: NextApiResponse) {
  // Delete all subjects of this teacher
  await prisma.teacherSubject.deleteMany({where: {teacherId: req.query.id as string}});

  // Add updated subjects
  const teacher = await prisma.teacher.update({
    where: {id: req.query.id as string},
    data: {
      TeacherSubject: {
        create: req.body.subjects.map((subject_id: number) => ({
          Subject: {connect: {id: subject_id}}
        })),
      }
    }
  });

  return res.status(200).json(teacher);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getSubjects(req, res);
    case "PUT":
      return updateSubjects(req, res);
  }
}