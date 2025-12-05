export const fieldTypes: Record<string, Record<string, 'string' | 'number' | 'boolean' | 'date'>> = {
    user: {
      id: 'number',
      firstname: 'string',
      lastname: 'string',
      email: 'string',
      password: 'string',
      role: 'string',
      isActive: 'boolean'
    },
    fueltype: {
      id: 'number',
      name: 'string'
    },
    category: {
      id: 'number',
      name: 'string'
    },
    brand: {
      id: 'number',
      name: 'string'
    },
    car: {
      id: 'number',
      model: 'string',
      year: 'number',
      price: 'string',
      categoryId: 'number',
      brandId: 'number',
      fueltypeId: 'number'
    }
  };