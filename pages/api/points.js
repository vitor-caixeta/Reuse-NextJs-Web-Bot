import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const points = await prisma.point.findMany();
    res.status(200).json(points);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pontos de coleta' });
  }
}
