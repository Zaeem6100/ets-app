import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";

async function getTeachers(req: NextApiRequest, res: NextApiResponse) {
  const subject = await prisma.subject.findUnique({
    where: {id: parseInt(req.query.id as string)},
    include: {
      TeacherSubject: {
        include: {
          Teacher: {
            include: {User: true}
          }
        }
      }
    }
  });
  return res.status(200).json(subject?.TeacherSubject);
}

async function updateTeachers(req: NextApiRequest, res: NextApiResponse) {
  // Delete all teacher for this subject
  await prisma.teacherSubject.deleteMany({where: {subjectId: parseInt(req.query.id as string)}});

  // Add updated subjects
  const subject = await prisma.subject.update({
    where: {id: parseInt(req.query.id as string)},
    data: {
      TeacherSubject: {
        create: req.body.teachers.map((teacher_id: string) => ({
          Teacher: {connect: {id: teacher_id}}
        })),
      }
    }
  });

  return res.status(200).json(subject);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getTeachers(req, res);
    case "PUT":
      return updateTeachers(req, res);
  }
}