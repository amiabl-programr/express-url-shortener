import express, { Express } from 'express';
import shortenRoute from './routes/shorten.route';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use('/api', shortenRoute);

app.use((_req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found' });
  next();
});

export default app;
