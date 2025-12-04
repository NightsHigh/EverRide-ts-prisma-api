import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { randomYear, randomPrice } from '../src/utils/randomData.js';

const prisma = new PrismaClient();

async function getUserSeeds() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  return [
    {
      firstName: 'Admin',
      lastName: 'Nielsen',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'Admin',
      isActive: true
    },
    {
      firstName: 'Bruger',
      lastName: 'Jensen',
      email: 'user@example.com',
      password: userPassword,
      role: 'User',
      isActive: true
    }
  ];
}

const categorySeeds = [
  { name: 'Personbil' },
  { name: 'Varevogn' },
  { name: 'Lastbil' },
  { name: 'Autocamper' },
  { name: 'Andre' }
];

const brandSeeds = [
  { name: 'Toyota' },
  { name: 'Volkswagen' },
  { name: 'BMW' },
  { name: 'Mercedes-Benz' },
  { name: 'Ford' },
  { name: 'Tesla' },
  { name: 'Volvo' }
];

const fuelTypes = ['Benzin', 'Diesel', 'El', 'Hybrid', 'Andre'];

const carModels = {
  'Toyota': ['Corolla', 'Yaris', 'RAV4', 'Camry'],
  'Volkswagen': ['Golf', 'Passat', 'Tiguan', 'Polo'],
  'BMW': ['3-serie', '5-serie', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Klasse', 'E-Klasse', 'GLC', 'A-Klasse'],
  'Ford': ['Focus', 'Fiesta', 'Kuga', 'Mondeo'],
  'Tesla': ['Model 3', 'Model Y', 'Model S'],
  'Volvo': ['V60', 'XC60', 'V90', 'XC90']
};

async function main() {
  console.log('🌱 Starting seed...');

  console.log('📦 Seeding brands...');
  await prisma.brand.createMany({
    data: brandSeeds,
    skipDuplicates: true
  });

  console.log('📂 Seeding categories...');
  await prisma.category.createMany({
    data: categorySeeds,
    skipDuplicates: true
  });

  console.log('👥 Seeding users...');
  const users = await getUserSeeds();
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      create: user,
      update: user
    });
  }

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  console.log('🚗 Seeding cars...');
  
  const carSeeds = [
    {
      model: 'Corolla Hybrid',
      year: randomYear(2020, 2024),
      price: randomPrice(250000, 350000).toString(),
      fueltype: 'Hybrid',
      brandId: brands.find(b => b.name === 'Toyota')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'RAV4',
      year: randomYear(2019, 2023),
      price: randomPrice(350000, 450000).toString(),
      fueltype: 'Benzin',
      brandId: brands.find(b => b.name === 'Toyota')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'Golf GTI',
      year: randomYear(2018, 2023),
      price: randomPrice(280000, 400000).toString(),
      fueltype: 'Benzin',
      brandId: brands.find(b => b.name === 'Volkswagen')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'Tiguan',
      year: randomYear(2020, 2024),
      price: randomPrice(400000, 550000).toString(),
      fueltype: 'Diesel',
      brandId: brands.find(b => b.name === 'Volkswagen')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: '3-serie',
      year: randomYear(2019, 2023),
      price: randomPrice(450000, 650000).toString(),
      fueltype: 'Diesel',
      brandId: brands.find(b => b.name === 'BMW')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'X5',
      year: randomYear(2020, 2024),
      price: randomPrice(700000, 950000).toString(),
      fueltype: 'Hybrid',
      brandId: brands.find(b => b.name === 'BMW')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'E-Klasse',
      year: randomYear(2018, 2023),
      price: randomPrice(500000, 750000).toString(),
      fueltype: 'Diesel',
      brandId: brands.find(b => b.name === 'Mercedes-Benz')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'Transit Custom',
      year: randomYear(2017, 2022),
      price: randomPrice(200000, 350000).toString(),
      fueltype: 'Diesel',
      brandId: brands.find(b => b.name === 'Ford')!.id,
      categoryId: categories.find(c => c.name === 'Varevogn')!.id
    },
    {
      model: 'Model 3',
      year: randomYear(2021, 2024),
      price: randomPrice(400000, 550000).toString(),
      fueltype: 'El',
      brandId: brands.find(b => b.name === 'Tesla')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'Model Y',
      year: randomYear(2022, 2024),
      price: randomPrice(500000, 650000).toString(),
      fueltype: 'El',
      brandId: brands.find(b => b.name === 'Tesla')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'XC60',
      year: randomYear(2019, 2023),
      price: randomPrice(450000, 650000).toString(),
      fueltype: 'Hybrid',
      brandId: brands.find(b => b.name === 'Volvo')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    },
    {
      model: 'V90',
      year: randomYear(2018, 2022),
      price: randomPrice(500000, 700000).toString(),
      fueltype: 'Diesel',
      brandId: brands.find(b => b.name === 'Volvo')!.id,
      categoryId: categories.find(c => c.name === 'Personbil')!.id
    }
  ];

  for (const car of carSeeds) {
    await prisma.car.create({
      data: car
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`   - ${brands.length} brands`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${carSeeds.length} cars`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
