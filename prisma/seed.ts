import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const brandSeeds = [
  { name: 'Tesla' },
  { name: 'BMW' },
  { name: 'Toyota' }
];

const categorySeeds = [
  { name: 'SUV' },
  { name: 'Sedan' },
  { name: 'Hatchback' }
];

async function main() {
  await prisma.brand.createMany({
    data: brandSeeds,
    skipDuplicates: true
  });

  await prisma.category.createMany({
    data: categorySeeds,
    skipDuplicates: true
  });

  console.log('Seed completed: brands and categories ensured.');
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

