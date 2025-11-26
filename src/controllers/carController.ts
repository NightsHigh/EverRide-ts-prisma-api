export const createRecord = async (req: Request, res: Response) => {
    const { category, brand, model, year, price, fueltype } = req.body;
  
    if (!category || !brand || !model || !year || !price || !fueltype) {
      return res.status(400).json({ error: 'Alle felter skal udfyldes' });
    }
  
    try {
      const data = await prisma.car.create({
        data: {
          category,
          brand,
          model,
          year: Number(year),
          price,
          fueltype
        }
      });
  
      return res.status(201).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Noget gik galt i serveren' });
    }
  };