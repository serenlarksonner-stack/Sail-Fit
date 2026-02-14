import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { SurveySubmission } from '../src/types';
import { validateSubmission } from './validation';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const submissionsPath = path.resolve(__dirname, '../data/submissions.json');

const ensureDataFile = async () => {
  try {
    await fs.access(submissionsPath);
  } catch {
    await fs.mkdir(path.dirname(submissionsPath), { recursive: true });
    await fs.writeFile(submissionsPath, '[]', 'utf-8');
  }
};

const readSubmissions = async (): Promise<SurveySubmission[]> => {
  await ensureDataFile();
  const content = await fs.readFile(submissionsPath, 'utf-8');
  const parsed = JSON.parse(content) as SurveySubmission[];
  return Array.isArray(parsed) ? parsed : [];
};

app.post('/api/submit', async (req, res) => {
  const submission = req.body as Partial<SurveySubmission>;
  const validationError = validateSubmission(submission);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const record: SurveySubmission = {
    timestamp: submission.timestamp!,
    sizeSystem: submission.sizeSystem!,
    shoeSize: submission.shoeSize!,
    country: submission.country!,
    sailNumber: submission.sailNumber,
    homeYachtClub: submission.homeYachtClub,
    consent: submission.consent!,
  };

  const current = await readSubmissions();
  current.push(record);
  await fs.writeFile(submissionsPath, JSON.stringify(current, null, 2), 'utf-8');

  return res.status(201).json({ ok: true });
});

app.get('/api/submissions', async (_req, res) => {
  const submissions = await readSubmissions();
  res.json({ submissions });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
