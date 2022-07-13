import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";
import bcrypt from "bcrypt";

type Teacher = {
  id: string,
  User: {
    cnic: string,
    name: string,
    password?: string,
    role: string,
  },
  institute: string,
  gender: string,
  createdAt: Date,
}

async function getTeachers(req: NextApiRequest, res: NextApiResponse<Teacher[]>) {
  let teachers: Teacher[] = await prisma.teacher.findMany({include: {User: true}});
  teachers = teachers.map((teacher) => {
    delete teacher?.User?.password;
    return teacher;
  });
  return res.status(200).json(teachers);
}

async function createTeacher(req: NextApiRequest, res: NextApiResponse<Teacher>) {
  let teacher: Teacher = await prisma.teacher.create(
    {
      data: {
        User: {
          create: {
            cnic: req.body.cnic,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 8),
            role: "teacher",
          }
        },
        institute: req.body.institute,
        gender: req.body.gender
      },
      include: {User: true}
    }
  );
  delete teacher?.User?.password

  return res.status(200).json(teacher);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getTeachers(req, res);
    case "POST":
      return createTeacher(req, res);
  }
}