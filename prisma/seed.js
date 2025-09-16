import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.tip.createMany({
    data: [
      { text: 'Reduza o consumo de plástico descartável' },
      { text: 'Separe corretamente o lixo reciclável' },
      { text: 'Evite desperdício de água e energia' },
      { text: 'Reaproveite materiais sempre que possível' },
      { text: 'Doe objetos que não utiliza mais' },
    ],
  });

  await prisma.point.createMany({
    data: [
      { city: 'São Paulo', name: 'Ponto de Coleta SP 1' },
      { city: 'Rio de Janeiro', name: 'Ponto de Coleta RJ 1' },
    ],
  });

  console.log('Seed concluído!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
