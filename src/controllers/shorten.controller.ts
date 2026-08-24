import type { Request, Response } from 'express';
import { createShortURL, getShortURLfromDb } from '../service/shorten.service.js';

const MAX_URL_LENGTH = 2048;
const HASH_VALUE_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function createShortURLController(req: Request, res: Response) {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || typeof originalUrl !== 'string') {
      return res.status(400).json({ message: 'originalUrl is required' });
    }

    const trimmedUrl = originalUrl.trim();

    if (trimmedUrl.length === 0 || trimmedUrl.length > MAX_URL_LENGTH) {
      return res.status(400).json({ message: 'originalUrl must be between 1 and 2048 characters' });
    }

    if (!isValidHttpUrl(trimmedUrl)) {
      return res.status(400).json({ message: 'originalUrl must be a valid http(s) URL' });
    }

    const shortenedURL = await createShortURL(trimmedUrl);

    return res.status(201).json({ message: 'URL shortened successfully', shortenedURL });
  } catch (error) {
    console.error('Error creating shortened URL:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getShortURLController(req: Request, res: Response) {
  try {
    const { hashValue } = req.params;
    console.log('Received Hash Value:', hashValue);

    if (!hashValue || !HASH_VALUE_REGEX.test(hashValue)) {
      return res.status(400).json({ message: 'Invalid hashValue format' });
    }

    const results = await getShortURLfromDb(hashValue);

    if (results.length === 0) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const originalUrl = results[0].long_url;
    return res.redirect(302, originalUrl);
  } catch (error) {
    console.error('Error retrieving URL:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
