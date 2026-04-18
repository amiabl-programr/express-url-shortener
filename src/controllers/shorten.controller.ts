import type { Request, Response } from 'express';
import { createShortURL, getShortURLfromDb } from '../service/shorten.service';


export async function createShortURLController(req: Request, res: Response)  {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl) {
            return res.status(400).json({ message: 'originalUrl is required' });
        }

        const shortenedURL = await createShortURL(originalUrl);

        return res.status(201).json({ message: 'URL shortened successfully', shortenedURL });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating shortened URL', error });
    }
}

export async function getShortURLController(req: Request, res: Response)  {
    try {
        const { hashValue } = req.params;
        console.log('Received Hash Value:', hashValue);
        
        if (!hashValue) {
            return res.status(400).json({ message: 'hashValue is required' });
        }

        const results = await getShortURLfromDb(hashValue);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'URL not found' });
        }

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving URL', error });
    }
}