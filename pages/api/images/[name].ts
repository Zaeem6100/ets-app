export const config = {
  api: {externalResolver: true}
}

import express from 'express';

const handler = express();
const imagesFolder = (process.env.DATA_PATH || process.cwd() + '/verification/data/') + 'images/';

handler.use('/api/images', express.static(imagesFolder));
export default handler;
