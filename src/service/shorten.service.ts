import { client } from '../db/db.js';
import { uuid } from 'uuidv4';

export async function createShortURL(originalUrl: string): Promise<string> {
  console.log('Original URL:', originalUrl);
  // check if originalUrl already exists in the database
  const existing = await client.query('SELECT short_url FROM urls WHERE long_url = $1', [
    originalUrl,
  ]);
  if (existing.rows.length > 0) {
    return existing.rows[0].short_url;
  }
  // insert new URL mapping into the database
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.SHORT_URL_BASE_PROD
      : process.env.SHORT_URL_BASE_DEV;

  const shortUrl = `${baseUrl}/${uuid()}`;
  await client.query('INSERT INTO urls (short_url, long_url) VALUES ($1, $2)', [
    shortUrl,
    originalUrl,
  ]);
  return shortUrl;
}

export async function getShortURLfromDb(hashValue: string) {
  const shortUrl = `${process.env.SHORT_URL_BASE_DEV}/${hashValue}`;
  const results = await client.query('SELECT * FROM urls WHERE short_url = $1', [shortUrl]);
  return results.rows;
}
