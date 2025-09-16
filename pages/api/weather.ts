import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { city } = req.query;

  if (!city) return res.status(400).json({ error: 'Cidade não informada' });

  try {
    // Exemplo de retorno fake
    res.status(200).json({
      name: city,
      weather: [{ description: 'Ensolarado' }],
      main: { temp: 28 },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar clima' });
  }
}
