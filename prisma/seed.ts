import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

async function getDefaultUser() {
  const hashedPassword = await bcrypt.hash('changeme', 10);

  return {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'Admin',
    isActive: true
  };
}

async function main() {
  await prisma.brand.createMany({
    data: brandSeeds,
    skipDuplicates: true
  });

  await prisma.category.createMany({
    data: categorySeeds,
    skipDuplicates: true
  });

  const defaultUser = await getDefaultUser();

  await prisma.user.upsert({
    where: { email: defaultUser.email },
    create: defaultUser,
    update: defaultUser
  });

  console.log('Seed completed: brands, categories, and default user ensured.');
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

