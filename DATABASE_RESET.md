# Database Reset Guide

## Nulstille databasen under udvikling

### Metode 1: Prisma Migrate Reset (Anbefalet)
Dette sletter alle data, dropper alle tabeller, og genskaber dem via migrationer + seed:

```bash
npx prisma migrate reset
```

Dette vil:
1. Slette alle tabeller
2. Køre alle migrationer igen
3. Automatisk køre seed-filen
4. Genskabe databasen fra bunden

### Metode 2: Manuel reset
Hvis du vil slette data manuelt:

```bash
npx prisma db push --force-reset

npm run prisma:migrate

npm run prisma:seed
```

### Metode 3: Prisma Studio
Du kan også slette data manuelt via Prisma Studio:

```bash
npx prisma studio
```

## Verificer seed data

### Via Prisma Studio
```bash
npx prisma studio
```
Åbn i browseren og tjek:
- Users tabel: Skal have 2 brugere (admin og user)
- Categories: 5 kategorier (Personbil, Varevogn, Lastbil, Autocamper, Andre)
- Brands: 7 brands
- Cars: Minimum 12 biler med relationer

### Via MySQL Client
```sql
SELECT COUNT(*) FROM user;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM brands;
SELECT COUNT(*) FROM cars;

SELECT 
  c.id,
  c.model,
  c.year,
  c.price,
  c.fueltype,
  b.name as brand,
  cat.name as category
FROM cars c
JOIN brands b ON c.brandId = b.id
JOIN categories cat ON c.categoryId = cat.id;
```

## Login credentials efter seed

### Admin bruger
- Email: `admin@example.com`
- Password: `admin123`
- Rolle: Admin

### Normal bruger
- Email: `user@example.com`
- Password: `user123`
- Rolle: User

## Seed kommandoer

```bash
npm run prisma:seed

npx prisma db seed
```

## Troubleshooting

### "Unique constraint failed" fejl
Betyder at data allerede eksisterer. Kør reset først:
```bash
npx prisma migrate reset
```

### Ingen data efter seed
Tjek konsol output for fejl. Kør:
```bash
npm run prisma:seed
```

