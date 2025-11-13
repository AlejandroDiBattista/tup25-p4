import { NextApiRequest, NextApiResponse } from 'next';

const API_URL = 'http://localhost:8000/api/products'; // Adjust the URL based on your FastAPI backend

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching products' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}