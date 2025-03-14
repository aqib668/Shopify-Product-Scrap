import NodeCache from 'node-cache';

const cache = new NodeCache();

export default function handler(req, res) {
  if (req.method === 'POST') {
    cache.flushAll();
    res.status(200).json({ message: 'Cache cleared' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
