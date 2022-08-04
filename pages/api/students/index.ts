import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";
import bcrypt from "bcrypt";
import uploader from "../../../lib/fileUploadServer";
import axios from "axios";

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
  _count?: {
    StudentExam: number,
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

async function getStudents(req: NextApiRequest, res: NextApiResponse<Student[]>) {
  let students: Student[] = await prisma.student.findMany({
    include: {
      User: true,
      _count: {
        select: {StudentExam: true},
      },
    }
  });
  students = students.map((student) => {
    delete student?.User?.password;
    return student;
  });
  return res.status(200).json(students);
}

async function createStudent(req: NextApiRequest, res: NextApiResponse) {
  const fields = await uploader(req);
  if (!fields) return res.status(403).json({});

  let student: Student = await prisma.student.create(
    {
      data: {
        User: {
          create: {
            cnic: fields.get('cnic') as string,
            name: fields.get('name') as string,
            password: bcrypt.hashSync(fields.get('password') as string, 8),
            role: "student",
          }
        },
        institute: fields.get('institute') as string,
        gender: fields.get('gender') as string,
        dob: new Date(fields.get('dob') as string),
      },
      include: {User: true}
    }
  );
  delete student?.User?.password

  try {
    // noinspection HttpUrlsUsage
    await axios.post(
      `http://${process.env.VERIFIER_HOST || "localhost"}:3001/register`,
      {id: student?.id, images: fields.get('images')},
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json({});
  }

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