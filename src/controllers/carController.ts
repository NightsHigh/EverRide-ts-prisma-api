import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

type CarPayload = {
  model?: string;
  year?: number;
  price?: string;
  fueltype?: string;
  brandId?: number;
  categoryId?: number;
};

const includeRelations = {
  brand: {
    select: {
      id: true,
      name: true
    }
  },
  category: {
    select: {
      id: true,
      name: true
    }
  }
};

const parseCarPayload = (body: Request['body']): CarPayload => {
  const payload: CarPayload = {};

  if (body.model !== undefined) payload.model = String(body.model);
  if (body.price !== undefined) payload.price = String(body.price);
  if (body.fueltype !== undefined) payload.fueltype = String(body.fueltype);
  if (body.year !== undefined) payload.year = Number(body.year);
  if (body.brandId !== undefined) payload.brandId = Number(body.brandId);
  if (body.categoryId !== undefined) payload.categoryId = Number(body.categoryId);

  return payload;
};

const verifyRelations = async (brandId: number, categoryId: number) => {
  const [brand, category] = await Promise.all([
    prisma.brand.findUnique({ where: { id: brandId }, select: { id: true } }),
    prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } })
  ]);

  return {
    brandExists: Boolean(brand),
    categoryExists: Boolean(category)
  };
};

export const getRecords = async (req: Request, res: Response) => {
  try {
    const data = await prisma.car.findMany({
      include: includeRelations,
      orderBy: {
        price: 'desc'
      }
    });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

export const getRecordById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await prisma.car.findUnique({
      where: {
        id: Number(id)
      },
      include: includeRelations
    });

    if (!data) {
      return res.status(404).json({ error: 'Bil ikke fundet' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  const { brandId, categoryId, model, year, price, fueltype } = parseCarPayload(req.body);

  if (
    brandId === undefined ||
    categoryId === undefined ||
    !model ||
    year === undefined ||
    !price ||
    !fueltype
  ) {
    return res.status(400).json({ error: 'Alle felter skal udfyldes' });
  }

  const { brandExists, categoryExists } = await verifyRelations(brandId, categoryId);

  if (!brandExists || !categoryExists) {
    return res.status(404).json({ error: 'Brand eller kategori blev ikke fundet' });
  }

  try {
    const newCar = await prisma.car.create({
      data: {
        categoryId,
        brandId,
        model,
        year,
        price,
        fueltype
      },
      include: includeRelations
    });

    return res.status(201).json({ id: newCar.id, message: 'Bil oprettet succesfuldt', car: newCar });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = parseCarPayload(req.body);

  try {
    const existingCar = await prisma.car.findUnique({
      where: { id: Number(id) }
    });

    if (!existingCar) {
      return res.status(404).json({ error: 'Bil ikke fundet' });
    }

    if (payload.brandId !== undefined || payload.categoryId !== undefined) {
      const relationBrandId = payload.brandId ?? existingCar.brandId;
      const relationCategoryId = payload.categoryId ?? existingCar.categoryId;

      const { brandExists, categoryExists } = await verifyRelations(relationBrandId, relationCategoryId);

      if (!brandExists || !categoryExists) {
        return res.status(404).json({ error: 'Brand eller kategori blev ikke fundet' });
      }
    }

    const updatedCar = await prisma.car.update({
      where: {
        id: Number(id)
      },
      data: {
        categoryId: payload.categoryId ?? existingCar.categoryId,
        brandId: payload.brandId ?? existingCar.brandId,
        model: payload.model ?? existingCar.model,
        year: payload.year ?? existingCar.year,
        price: payload.price ?? existingCar.price,
        fueltype: payload.fueltype ?? existingCar.fueltype
      },
      include: includeRelations
    });

    return res.status(200).json({ id: updatedCar.id, message: 'Bil opdateret succesfuldt', car: updatedCar });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingCar = await prisma.car.findUnique({
      where: { id: Number(id) }
    });

    if (!existingCar) {
      return res.status(404).json({ error: 'Bil ikke fundet' });
    }

    await prisma.car.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({ id: Number(id), message: 'Bil slettet succesfuldt' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};