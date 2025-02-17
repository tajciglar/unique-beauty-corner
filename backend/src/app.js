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
// Get all appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const availableAppointments = await prisma.appointment.findMany({
            where: {
                available: true,
            }
        });

        const bookedAppointments = await prisma.appointment.findMany({
            where: {
                available: false,
            },
            include: {
                orders: {
                    include: {
                        services: true,
                    }
                }
            },
        });
        console.log(bookedAppointments)
        res.status(200).json({availableAppointments, bookedAppointments});
    } catch (error) {
        console.error("Error fetching termini:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new termin
app.post('/api/appointments', async (req, res) => {
    const appointment = req.body;

    await prisma.appointment.create({
        data: {
            ...appointment
        }
    });

    res.json({ message: 'New appointment added',  });
});

// Update termin
app.put('/api/appointment/:id', async (req, res) => {
    console.log(req)
});

// Delete termin
app.delete('/api/appointment/:id', async (req, res) => {
    console.log(req)
});


app.get('/api/services', async (req, res) => {
    try {
        const services = await prisma.serviceCategory.findMany(
            {
                include: {
                    services: true
                }
            }
        );
        if(!services) {
            return res.status(404).json({ message: 'Error getting services' });
        }
        console.log(services)
        res.json(services);
    } catch (error) {
        console.error(error);
    }
});

app.post('/api/orders', async (req, res) => {
    const { name, phone, email, date, startTime, endTime, services } = req.body;

    let appointment = await prisma.appointment.findFirst({
        where: {date, startTime, endTime}
    })
    if(appointment){
        res.status(400).send({message: "Termin zaseden"})
    }
    
    if(!appointment) {
        appointment = await prisma.appointment.create({
            data: {
                date,
                startTime,
                endTime,
                avaliable: false,
            }
        });

        const newOrder = await prisma.orders.create({
            data: {
                name,
                email,
                phone,
                price: services.reduce((sum, s) => sum + Number(s.price), 0),
                appointmentId: appointment.appointmentId,
                services: {
                    connect: services.map((service) => ({
                        serviceId: service.serviceId,
                    }))
                }
            },
            include: {
                appointment: true,
                services: true,
            }
        })
        console.log(newOrder)
        if(!newOrder) {
            return res.status(404).json({ message: 'New order can not be made' });
        }

        res.status(200).send(newOrder);
    }
    
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
