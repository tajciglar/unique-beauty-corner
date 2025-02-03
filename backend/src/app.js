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
    const termin = req.body;

    await prisma.termin.create({
        data: {
            ...termin
        }
    });

    res.json({ message: 'Termin dodan',  });
});

// Update termin
app.put('/api/termini/:id', async (req, res) => {
    console.log(req)
});

// Delete termin
app.delete('/api/termini/:id', async (req, res) => {
    console.log(req)
});


app.get('/api/services', async (req, res) => {
    try {
        const storitve = await prisma.kategorijaStoritev.findMany(
            {
                include: {
                    storitve: true
                }
            }
        );
        if(!storitve) {
            return res.status(404).json({ message: 'Ni storitev' });
        }

        res.json(storitve);
    } catch (error) {
        console.error(error);
    }
});

app.post('/api/narocila', async (req, res) => {
    const narocilo = req.body;
    console.log(narocilo)
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
