import path from 'path';
import bcrypt from 'bcrypt';
import { readdir, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { fieldTypes } from './types';
import { prisma } from '../src/prisma';

const models = Object.keys(fieldTypes);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'csv');

async function main() {
  const csvFiles = (await readdir(dir)).filter(f => f.endsWith('.csv'));

  console.log('🗑️  Sletter eksisterende data...');
  await prisma.car.deleteMany();
  await prisma.fueltype.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  
  const seedOrder = ['user', 'fueltype', 'category', 'brand', 'car'];
  
  for (const model of seedOrder) {
    const file = `${model}.csv`;
    if (!csvFiles.includes(file)) {
      console.log(`⚠️  Ingen ${file} fil fundet - springer over`);
      continue;
    }
    
    const raw = parse(await readFile(path.join(dir, file), 'utf-8'), {
      columns: true,
      skip_empty_lines: true
    });

    const data = await Promise.all(raw.map((row: any) => cast(model, row)));
    await (prisma as any)[model].createMany({ data, skipDuplicates: true });
    console.log(`✅ ${model}: ${data.length} rækker indsat`);
  }
}

async function cast(model: string, row: any) {
  const types = fieldTypes[model];
  const out: any = {};

  for (const key in row) {
    const val = row[key]?.toString().trim();
    const type = types[key];

    if (key === 'password') out[key] = await bcrypt.hash(val, 10);
    else if (type === 'number') out[key] = Number(val);
    else if (type === 'boolean') out[key] = val !== '0';
    else if (type === 'date') out[key] = val ? new Date(val) : null;
    else out[key] = val ?? null;
  }
  return out;
}

main()
  .then(() => console.log('CSV seed completed successfully!'))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());