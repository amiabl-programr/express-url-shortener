import express, { Express } from 'express';
import shortenRoute from './routes/shorten.route.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api', shortenRoute);

app.use((_req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
  next();
});

export default app;
