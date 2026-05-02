import { client } from '../db/db.js';
import { uuid } from 'uuidv4';

export async function createShortURL(originalUrl: string): Promise<string> {
  console.log('Original URL:', originalUrl);
  // check if originalUrl already exists in the database
  const existing = await client.query('SELECT short_code FROM urls WHERE long_url = $1', [
    originalUrl,
  ]);
  if (existing.rows.length > 0) {
    return constructShortUrl(existing.rows[0].short_code);
  }
  // insert new URL mapping into the database
  const shortCode = uuid();
  console.log('Generated Short Code:', shortCode);
  await client.query('INSERT INTO urls (short_code, long_url) VALUES ($1, $2)', [
    shortCode,
    originalUrl,
  ]);
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
  const results = await client.query('SELECT * FROM urls WHERE short_code = $1', [hashValue]);
  return results.rows;
}
