/* eslint-disable @next/next/no-server-import-in-page */
import {NextApiRequest, NextApiResponse} from "next";
import {jwtVerify} from 'jose'

export async function verifyAuth(req: NextApiRequest, res: NextApiResponse) {

  if (!req.headers.authorization) {
    return res.status(401).json({error: 'missing authentication token'})
  }

  try {
    const authSplit = req.headers.authorization.split(" ");
    let token = ""
    if (authSplit.length >= 2 && authSplit[0] == "Bearer") {
      token = authSplit[1];
    } else {
      return res.status(400).json({error: 'invalid authentication token'})
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    )
    return verified.payload
  } catch (err) {
    return res.status(401).json({error: 'authentication required'})
  }
}
