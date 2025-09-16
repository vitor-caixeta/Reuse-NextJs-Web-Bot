import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const tips = await prisma.tip.findMany();
    res.status(200).json(tips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dicas' });
  }
}
