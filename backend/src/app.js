import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import appointmentRoutes from './routes/appointmentRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000' // Development URL
        ];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/services', servicesRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
