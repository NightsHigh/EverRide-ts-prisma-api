import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma.js';

export const getUserData = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Ingen bruger data fundet' });
  }

  res.json({
    message: 'Token er gyldig',
    user: req.user
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email og password er påkrævet' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Ugyldige login oplysninger' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Ugyldige login oplysninger' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Bruger er deaktiveret' });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET er ikke defineret i miljøvariablerne');
      return res.status(500).json({ error: 'Server konfigurationsfejl' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
      
    const token = jwt.sign(tokenPayload, secret, { expiresIn: '24h' });

    res.json({
      message: 'Login succesfuld',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login fejlede' });
  }
};

