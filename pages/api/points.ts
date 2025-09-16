import type { NextApiRequest, NextApiResponse } from 'next';

// Cache em memória (simples)
let cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_TIME = 30 * 60 * 1000; // 30 minutos

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const city = req.query.city as string;
    if (!city) return res.status(400).json({ error: 'Cidade é obrigatória' });

    const cacheKey = city.toLowerCase();
    const now = Date.now();

    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TIME) {
      return res.status(200).json(cache[cacheKey].data);
    }

    const query = `
      [out:json][timeout:25];
      area["name"="${city}"]->.a;
      (
        node["amenity"="recycling"](area.a);
        way["amenity"="recycling"](area.a);
        relation["amenity"="recycling"](area.a);
      );
      out center;
    `;

    const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Overpass API retornou erro: ${text}`);
    }

    const data = await response.json();

    // Armazena no cache
    cache[cacheKey] = { data, timestamp: now };

    res.status(200).json(data);
  } catch (err: any) {
    console.error('Erro ao buscar pontos de coleta:', err);
    res.status(500).json({ error: 'Não foi possível buscar os pontos de coleta' });
  }
}
