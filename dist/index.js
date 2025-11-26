import express from 'express';
import dotenv from 'dotenv';
import { carRoutes } from './routes/carRoutes.js';
import { brandRoutes } from './routes/brandRoutes.js';
import { categoryRoutes } from './routes/categoryRoutes.js';
// Indlæs miljøvariabler fra .env (uden at vise logs)
dotenv.config({ quiet: true });
// Brug port fra .env eller falde tilbage til 3000
const port = process.env.SERVERPORT || 3000;
// Opret express-app
const app = express();
// Gør det muligt at modtage JSON i requests
app.use(express.json());
// Gør det muligt at modtage form-data (fx fra formularer)
app.use(express.urlencoded({ extended: true }));
// Brug vores routes
app.use('/api/cars', carRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
// Start serveren
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
