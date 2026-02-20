import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { analyzeBloodReport } from './flows/medical-info-summarization';

function extToMime(ext: string) {
  ext = ext.toLowerCase();
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: npx ts-node ai/run-sample.ts <path-to-file|data-uri>');
    process.exit(1);
  }

  let dataUri = arg;
  if (!arg.startsWith('data:')) {
    const filePath = path.resolve(arg);
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      process.exit(1);
    }
    const ext = path.extname(filePath);
    const mime = extToMime(ext);
    const buf = fs.readFileSync(filePath);
    const b64 = buf.toString('base64');
    dataUri = `data:${mime};base64,${b64}`;
  }

  try {
    const result = await analyzeBloodReport({ reportDataUri: dataUri });
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error running analysis:', err);
    process.exit(1);
  }
}

main();
