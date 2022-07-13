import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";
import bcrypt from "bcrypt";

async function updateTeacher(req: NextApiRequest, res: NextApiResponse) {

  let newUser: { name: string, password?: string } = {
    name: req.body.name,
  };

  if (req.body.password)
    newUser['password'] = bcrypt.hashSync(req.body.password, 8);

  const teacher = await prisma.teacher.update({
    where: {id: req.query.id as string},
    data: {
      institute: req.body.institute,
      gender: req.body.gender,
      User: {update: newUser}
    },
    include: {User: true}
  });

  return res.status(200).json(teacher);
}

async function deleteTeacher(req: NextApiRequest, res: NextApiResponse) {
  const teacher = await prisma.teacher.delete({where: {id: req.query.id as string}});
  await prisma.user.delete({where: {cnic: req.query.id as string}});
  return res.status(200).json(teacher);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return updateTeacher(req, res);
    case "DELETE":
      return deleteTeacher(req, res);
  }
}