import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../../lib/db";
import bcrypt from "bcrypt";

async function updateStudent(req: NextApiRequest, res: NextApiResponse) {
  let newUser: { name: string, password?: string } = {
    name: req.body.name,
  };

  if (req.body.password)
    newUser['password'] = bcrypt.hashSync(req.body.password, 8);

  const student = await prisma.student.update({
    where: {id: req.query.id as string},
    data: {
      institute: req.body.institute,
      gender: req.body.gender,
      User: {update: newUser},
      dob: new Date(req.body.dob),
    },
    include: {User: true}
  });

  return res.status(200).json(student);
}

async function deleteStudent(req: NextApiRequest, res: NextApiResponse) {
  const student = await prisma.student.delete({where: {id: req.query.id as string}});
  await prisma.user.delete({where: {cnic: req.query.id as string}});
  return res.status(200).json(student);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return updateStudent(req, res);
    case "DELETE":
      return deleteStudent(req, res);
  }
}