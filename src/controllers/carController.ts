import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const data = await prisma.car.findMany({
      select: {
        id: true,
        brand: true,
        model: true,
        price: true
      },
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
      }
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
  const { category, brand, model, year, price, fueltype } = req.body;

  if (!category || !brand || !model || !year || !price || !fueltype) {
    return res.status(400).json({ error: 'Alle felter skal udfyldes' });
  }

  try {
    const newCar = await prisma.car.create({
      data: {
        category,
        brand,
        model,
        year: Number(year),
        price,
        fueltype
      }
    });

    return res.status(201).json({ id: newCar.id, message: 'Bil oprettet succesfuldt', car: newCar });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { category, brand, model, year, price, fueltype } = req.body;

  try {
    const existingCar = await prisma.car.findUnique({
      where: { id: Number(id) }
    });

    if (!existingCar) {
      return res.status(404).json({ error: 'Bil ikke fundet' });
    }

    const updatedCar = await prisma.car.update({
      where: {
        id: Number(id)
      },
      data: {
        category: category || existingCar.category,
        brand: brand || existingCar.brand,
        model: model || existingCar.model,
        year: year ? Number(year) : existingCar.year,
        price: price || existingCar.price,
        fueltype: fueltype || existingCar.fueltype
      }
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