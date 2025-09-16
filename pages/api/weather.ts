import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const city = req.query.city as string;
    if (!city) return res.status(400).json({ error: 'Cidade é obrigatória' });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) throw new Error('OPENWEATHER_API_KEY não definida');

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenWeatherMap retornou erro: ${text}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    console.error('Erro no weather API:', err);
    res.status(500).json({ error: 'Não foi possível buscar o clima' });
  }
}