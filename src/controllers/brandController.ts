import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const data = await prisma.brand.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
};

export const getRecordById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await prisma.brand.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!data) {
      return res.status(404).json({ error: 'Brand ikke fundet' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Brand navn skal udfyldes' });
  }

  try {
    const newBrand = await prisma.brand.create({
      data: {
        name
      }
    });

    return res.status(201).json({ id: newBrand.id, message: 'Brand oprettet succesfuldt', brand: newBrand });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Brand navn skal udfyldes' });
  }

  try {
    const existingBrand = await prisma.brand.findUnique({
      where: { id: Number(id) }
    });

    if (!existingBrand) {
      return res.status(404).json({ error: 'Brand ikke fundet' });
    }

    const updatedBrand = await prisma.brand.update({
      where: {
        id: Number(id)
      },
      data: {
        name
      }
    });

    return res.status(200).json({ id: updatedBrand.id, message: 'Brand opdateret succesfuldt', brand: updatedBrand });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingBrand = await prisma.brand.findUnique({
      where: { id: Number(id) }
    });

    if (!existingBrand) {
      return res.status(404).json({ error: 'Brand ikke fundet' });
    }

    await prisma.brand.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({ id: Number(id), message: 'Brand slettet succesfuldt' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

