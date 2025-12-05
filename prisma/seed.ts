import bcrypt from 'bcrypt';
import { prisma } from '../src/prisma';


const main = async () => {
 

  await prisma.car.deleteMany();
  await prisma.fueltype.deleteMany(); 
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  // Opretter en testbruger i databasen
  const user = await prisma.user.create({
    data: {
      firstname: "Test", 
      lastname: "Bruger", 
      email: "test@example.com", 
      password: await bcrypt.hash('password', 10), 
      role: "USER", 
      isActive: true 
    }
  });

  console.log("Seed completed for users:", user);

  const fueltypes = await prisma.fueltype.createMany({
    data: [
      { name: "Benzin" }, 
      { name: "Diesel" },
      { name: "Hybrid" }, 
      { name: "Electricity" }, 
      { name: "Coffee" } 
    ]
  });

  console.log("Seed completed for fueltypes:", fueltypes);

  const categories = await prisma.category.createMany({
    data: [
      { name: "Personbil" },
      { name: "Varevogn" },
      { name: "Lastbil" },
      { name: "Autocamper" },
      { name: "Andre" }
    ]
  });
  console.log("Seed completed for categories:", categories);

  const brands = await prisma.brand.createMany({
    data: [
      { name: "Toyota" },
      { name: "Volkswagen" },
      { name: "BMW" },
      { name: "Mercedes-Benz" },
      { name: "Ford" },
      { name: "Tesla" },
      { name: "Volvo" }
    ]
  });
  console.log("Seed completed for brands:", brands);

  const allFueltypes = await prisma.fueltype.findMany();
  const allCategories = await prisma.category.findMany();
  const allBrands = await prisma.brand.findMany();

  const benzinId = allFueltypes.find(f => f.name === "Benzin")?.id || 1;
  const dieselId = allFueltypes.find(f => f.name === "Diesel")?.id || 1;
  const hybridId = allFueltypes.find(f => f.name === "Hybrid")?.id || 1;
  const electricityId = allFueltypes.find(f => f.name === "Electricity")?.id || 1;

  const personbilId = allCategories.find(c => c.name === "Personbil")?.id || 1;
  const varevognId = allCategories.find(c => c.name === "Varevogn")?.id || 1;
  const toyotaId = allBrands.find(b => b.name === "Toyota")?.id || 1;
  const volkswagenId = allBrands.find(b => b.name === "Volkswagen")?.id || 1;
  const teslaId = allBrands.find(b => b.name === "Tesla")?.id || 1;
  const fordId = allBrands.find(b => b.name === "Ford")?.id || 1;
  const volvoId = allBrands.find(b => b.name === "Volvo")?.id || 1;

  const cars = await prisma.car.createMany({
    data: [
      {
        model: "Corolla Hybrid",
        year: 2023,
        price: "299000",
        categoryId: personbilId,
        brandId: toyotaId,
        fueltypeId: hybridId
      },
      {
        model: "Golf GTI",
        year: 2022,
        price: "350000",
        categoryId: personbilId,
        brandId: volkswagenId,
        fueltypeId: benzinId
      },
      {
        model: "Model 3",
        year: 2024,
        price: "450000",
        categoryId: personbilId,
        brandId: teslaId,
        fueltypeId: electricityId
      },
      {
        model: "Transit Custom",
        year: 2021,
        price: "280000",
        categoryId: varevognId,
        brandId: fordId,
        fueltypeId: dieselId
      },
      {
        model: "XC60",
        year: 2023,
        price: "550000",
        categoryId: personbilId,
        brandId: volvoId,
        fueltypeId: hybridId
      }
    ]
  });
  console.log("Seed completed for cars:", cars);
}

main()
  .then(() => prisma.$disconnect()) 
  .catch((e) => {
    console.error(e); 
    prisma.$disconnect();
    process.exit(1);
  });
