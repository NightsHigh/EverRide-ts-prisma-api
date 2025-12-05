import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('🔍 Verifying seed data...\n');

  // Count records
  const userCount = await prisma.user.count();
  const categoryCount = await prisma.category.count();
  const brandCount = await prisma.brand.count();
  const carCount = await prisma.car.count();

  console.log('📊 Record counts:');
  console.log(`   Users: ${userCount} (expected: 2)`);
  console.log(`   Categories: ${categoryCount} (expected: 5)`);
  console.log(`   Brands: ${brandCount} (expected: 7)`);
  console.log(`   Cars: ${carCount} (expected: 12+)\n`);

  // List users
  console.log('👥 Users:');
  const users = await prisma.user.findMany({
    select: { id: true, firstName: true, lastName: true, email: true, role: true }
  });
  users.forEach(u => console.log(`   ${u.id}. ${u.firstName} ${u.lastName} (${u.email}) - Role: ${u.role}`));

  // List categories
  console.log('\n📂 Categories:');
  const categories = await prisma.category.findMany();
  categories.forEach(c => console.log(`   ${c.id}. ${c.name}`));

  // List brands
  console.log('\n🏢 Brands:');
  const brands = await prisma.brand.findMany();
  brands.forEach(b => console.log(`   ${b.id}. ${b.name}`));

  // Sample cars with relations
  console.log('\n🚗 Sample cars (first 5):');
  const cars = await prisma.car.findMany({
    take: 5,
    include: {
      brand: true,
      category: true
    }
  });
  cars.forEach(c => {
    console.log(`   ${c.id}. ${c.brand.name} ${c.model} (${c.year}) - ${c.fueltype} - ${c.category.name} - ${c.price} kr`);
  });

  // Fuel type distribution
  console.log('\n⛽ Fuel types:');
  const fuelTypes = await prisma.car.groupBy({
    by: ['fueltype'],
    _count: true
  });
  fuelTypes.forEach(f => console.log(`   ${f.fueltype}: ${f._count} cars`));

  console.log('\n✅ Verification complete!');
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

