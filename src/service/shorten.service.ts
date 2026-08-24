import { client } from '../db/db.js';
import { uuid } from 'uuidv4';

const SLOW_QUERY_MS = 500;

function logQueryDuration(operation: string, start: number): void {
  const durationMs = Date.now() - start;
  if (durationMs >= SLOW_QUERY_MS) {
    console.warn(`[SLOW DB] ${operation} took ${durationMs}ms`);
  } else {
    console.log(`[DB] ${operation} took ${durationMs}ms`);
  }
}

export async function createShortURL(originalUrl: string): Promise<string> {
  const requestStart = Date.now();

  // check if originalUrl already exists in the database
  const selectStart = Date.now();
  const existing = await client.query('SELECT short_code FROM urls WHERE long_url = $1', [
    originalUrl,
  ]);
  logQueryDuration('SELECT existing URL', selectStart);

  if (existing.rows.length > 0) {
    console.log(`[DB] Duplicate URL found, reusing short_code (total so far: ${Date.now() - requestStart}ms)`);
    return constructShortUrl(existing.rows[0].short_code);
  }

  // insert new URL mapping into the database
  const shortCode = uuid();
  const insertStart = Date.now();
  await client.query('INSERT INTO urls (short_code, long_url) VALUES ($1, $2)', [
    shortCode,
    originalUrl,
  ]);
  logQueryDuration('INSERT new URL', insertStart);

  console.log(`[DB] createShortURL total time: ${Date.now() - requestStart}ms`);
  return constructShortUrl(shortCode);
}

// Helper function to construct full short URL from hash
function constructShortUrl(shortCode: string): string {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.SHORT_URL_BASE_PROD
      : process.env.SHORT_URL_BASE_DEV;
  return `${baseUrl}/${shortCode}`;
}

export async function getShortURLfromDb(hashValue: string) {
  const start = Date.now();
  const results = await client.query('SELECT * FROM urls WHERE short_code = $1', [hashValue]);
  logQueryDuration('SELECT by short_code', start);
  return results.rows;
}
