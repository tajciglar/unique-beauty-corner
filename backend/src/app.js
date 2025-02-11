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
        console.log(storitve)
        res.json(storitve);
    } catch (error) {
        console.error(error);
    }
});

app.post('/api/narocila', async (req, res) => {
    const { ime, telefon, email, datum, startTime, endTime, storitve } = req.body;

    let termin = await prisma.termin.findFirst({
        where: {datum, startTime, endTime}
    })
    if(termin){
        res.status(400).send({message: "Termin zaseden"})
    }
    
    if(!termin) {
        termin = await prisma.termin.create({
            data: {
                datum,
                startTime,
                endTime,
                naVoljo: false,
            }
        });

        const novoNarocilo = await prisma.naročila.create({
            data: {
                ime,
                email,
                telefon,
                cena: storitve.reduce((sum, s) => sum + Number(s.cena), 0),
                terminId: termin.terminId,
                storitve: {
                    connect: storitve.map((storitev) => ({
                        idStoritve: storitev.idStoritve,
                    }))
                }
            },
            include: {
                termin: true,
                storitve: true,
            }
        })
        console.log(novoNarocilo)
        if(!novoNarocilo) {
            return res.status(404).json({ message: 'Naročila ni mogoče ustvariti' });
        }

        res.status(200).send(novoNarocilo);
    }
    
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
