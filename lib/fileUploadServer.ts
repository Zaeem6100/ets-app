import formidable, {File} from "formidable";
import {promises as fs} from "fs";
import {NextApiRequest} from "next";

async function writeFile(file: File, des: string): Promise<string> {
  const tempPath = file.filepath;
  const newPath = `${des}${+new Date()}_${file.originalFilename}`;
  await fs.copyFile(tempPath, newPath);
  await fs.unlink(tempPath);
  return newPath;
}

export default async function uploader(req: NextApiRequest): Promise<void | Map<string, string | string[]>> {
  const targetPath = (process.env.DATA_PATH || process.cwd() + '/verification/data/') + 'images/';
  try {
    await fs.access(targetPath);
  } catch (e) {
    await fs.mkdir(targetPath, {recursive: true});
  }

  return await new Promise<void | Map<string, string | string[]>>((resolve, reject) => {
    const form = new formidable.IncomingForm();
    let files = new Array<{ field: string, file: File }>;
    const fields = new Map<string, string | string[]>();
    form.on('file', async function (field, file) {
      files.push({field, file});
    });
    form.on('field', (name, value) => {
      fields.set(name, value)
    });
    form.on('end', async () => {
      for (const x of files) {
        const filePath = await writeFile(x.file, targetPath);
        let f: string[] = fields.has(x.field) ? fields.get(x.field) as [] : [];
        f.push(filePath);
        fields.set(x.field, f);
      }
      resolve(fields);
    });
    form.on('error', err => reject(err));
    form.parse(req);
  }).catch(e => {
    console.log(e);
  });
}
