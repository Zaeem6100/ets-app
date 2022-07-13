import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../../lib/db";
import {SignJWT} from 'jose';
import bcrypt from "bcrypt";
import {nanoid} from "nanoid";

type Data = {
  token?: string,
  error?: string,
}

type LoginRequest = {
  cnic: string,
  password: string,
}

async function login(body: LoginRequest) {

  // Validation
  if (body.cnic && body.password) {
    if (body.cnic.length < 13) return {error: "CNIC is not valid"};
    if (body.password.length < 6) return {error: "Wrong password"};
  }

  // verify credentials
  const user = await prisma.user.findUnique({where: {cnic: body.cnic}});
  if (!user) return {error: "User not found"};

  if (!bcrypt.compareSync(body.password, user.password)) {
    return {error: 'Wrong password'};
  }

  // User's credentials verified
  // sign and returns the JWT token
  const token = await new SignJWT({
    name: user.name,
    cnic: user.cnic,
    role: user.role
  })
    .setProtectedHeader({alg: 'HS256'})
    .setJti(nanoid())
    .setIssuedAt()
    .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));

  return {token, status: 200};
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method != 'POST') return res.status(405).json({error: 'Method not allowed'});
  const {token, error, status = 400} = await login(req.body);
  res.status(status).json({token, error});
}
