import bcrypt from 'bcrypt';
import { prisma } from '../prisma.js';
const userSelect = {
    id: true,
    firstName: true,
    lastName: true,
    email: true,
    role: true,
    isActive: true
};
export const getRecords = async (_req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: userSelect,
            orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
export const getRecordById = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user id' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: userSelect
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
export const createRecord = async (req, res) => {
    const { firstName, lastName, email, password, role, isActive } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res
            .status(400)
            .json({ error: 'firstName, lastName, email, and password are required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                isActive
            },
            select: userSelect
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};
export const updateRecord = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user id' });
    }
    const { firstName, lastName, email, password, role, isActive } = req.body;
    if (firstName === undefined &&
        lastName === undefined &&
        email === undefined &&
        password === undefined &&
        role === undefined &&
        isActive === undefined) {
        return res.status(400).json({ error: 'Provide at least one field to update' });
    }
    try {
        let hashedPassword;
        if (password !== undefined) {
            hashedPassword = await bcrypt.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...(firstName !== undefined && { firstName }),
                ...(lastName !== undefined && { lastName }),
                ...(email !== undefined && { email }),
                ...(hashedPassword !== undefined && { password: hashedPassword }),
                ...(role !== undefined && { role }),
                ...(isActive !== undefined && { isActive })
            },
            select: userSelect
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
};
export const deleteRecord = async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({ error: 'Invalid user id' });
    }
    try {
        await prisma.user.delete({
            where: { id }
        });
        res.status(200).json({ id, message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
