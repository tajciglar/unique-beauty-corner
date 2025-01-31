const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
// Get termins
app.get('api/termini', async (req, res) => {
    
    res.json(termini);
});

// Add new termin
app.post('api/termini', async (req, res) => {
    console.log(req.body);
});

// Update termin
app.put('api/termini/:id', async (req, res) => {   });


// Izbriši termin
app.delete('api/termini/:id', async (req, res) => {   });



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));