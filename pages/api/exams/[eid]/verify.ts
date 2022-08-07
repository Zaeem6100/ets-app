import {verifyAuth} from "../../../../lib/authServer";
import {JWTPayload} from "jose";
import {NextApiRequest, NextApiResponse} from "next";
import axios from "axios";
import uploader from "../../../../lib/fileUploadServer";

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function verifyFace(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({});

  const fields = await uploader(req);
  if (!fields) return res.status(403).json({});

  const payload = await verifyAuth(req, res) as JWTPayload;
  const seid = parseInt(fields.get('studentexamId') as string);

  try {
    // noinspection HttpUrlsUsage
    await axios.post(
      `http://${process.env.VERIFIER_HOST || 'localhost'}:3001/verify`,
      {
        id: payload['cnic'],
        seid,
        image: (fields.get('image') as string[])[0],
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json({});
  }

  return res.status(200).json({});
}
