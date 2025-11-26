import { Request, Response } from 'express';
import { prisma } from '../prisma.js';

export const getRecords = async (req: Request, res: Response) => {
  try {
    const data = await prisma.category.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'desc'
      }
    });
    
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const getRecordById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await prisma.category.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!data) {
      return res.status(404).json({ error: 'Kategori ikke fundet' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Kategori navn skal udfyldes' });
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name
      }
    });

    return res.status(201).json({ id: newCategory.id, message: 'Kategori oprettet succesfuldt', category: newCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Kategori navn skal udfyldes' });
  }

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Kategori ikke fundet' });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: Number(id)
      },
      data: {
        name
      }
    });

    return res.status(200).json({ id: updatedCategory.id, message: 'Kategori opdateret succesfuldt', category: updatedCategory });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Kategori ikke fundet' });
    }

    await prisma.category.delete({
      where: {
        id: Number(id)
      }
    });

    return res.status(200).json({ id: Number(id), message: 'Kategori slettet succesfuldt' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Noget gik galt i serveren' });
  }
};

