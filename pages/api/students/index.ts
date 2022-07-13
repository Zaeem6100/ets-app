import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";
import bcrypt from "bcrypt";

type Student = {
  id: string,
  User: {
    cnic: string,
    name: string,
    password?: string,
    role: string,
  },
  dob: Date,
  gender: string,
  institute: string,
  createdAt: Date,
}

async function getStudents(req: NextApiRequest, res: NextApiResponse<Student[]>) {
  let students: Student[] = await prisma.student.findMany({include: {User: true}});
  students = students.map((student) => {
    delete student?.User?.password;
    return student;
  });
  return res.status(200).json(students);
}

async function createStudent(req: NextApiRequest, res: NextApiResponse<Student>) {
  let student: Student = await prisma.student.create(
    {
      data: {
        User: {
          create: {
            cnic: req.body.cnic,
            name: req.body.name,
            password: bcrypt.hashSync(req.body.password, 8),
            role: "student",
          }
        },
        institute: req.body.institute,
        gender: req.body.gender,
        dob: new Date(req.body.dob),
      },
      include: {User: true}
    }
  );
  delete student?.User?.password

  return res.status(200).json(student);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getStudents(req, res);
    case "POST":
      return createStudent(req, res);
  }
}