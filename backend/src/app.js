import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
// Get all termini
app.get('/api/termini', async (req, res) => {
    try {
        const termini = await prisma.termin.findMany();

        if(!termini) {
            return res.status(404).json({ message: 'Ni prostih terminov' });
        }

        res.json(termini);
    } catch (error) {
        console.error(error);
    }
});

// Add new termin
app.post('/api/termini', async (req, res) => {
    console.log(req)
});

// Update termin
app.put('/api/termini/:id', async (req, res) => {
    console.log(req)
});

// Delete termin
app.delete('/api/termini/:id', async (req, res) => {
    console.log(req)
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
