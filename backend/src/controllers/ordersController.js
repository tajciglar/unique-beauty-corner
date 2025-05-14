import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
            include: {
                appointment: true,
                services: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Server error' });
    }
}    

const createOrder = async (req, res) => {
    const { name, phone, email, date, startTime, duration , services, price, appointmentId } = req.body;
   
    const existingOrder = await prisma.order.findFirst({
        where: {
            appointment: {
                date,
                startTime,
                available: false,
            },
            appointmentId: appointmentId
        },
    });

    if (existingOrder) {
        return res.status(400).send({ message: "Termin zaseden" });
    }

    // get appointment
    const appointment = await prisma.appointment.findUnique({
        where: {
            id: appointmentId,
        },
        include: {
            order: true,
        }
    });
    

    

    const newOrder = await prisma.order.create({
        data: {
            name,
            email,
            phone,
            price: services.reduce((sum, s) => sum + Number(s.price), 0),
            duration: duration,
            price: price,
            appointment: {
                connect: {
                    id: appointmentId,
                },
            },
            services: {
                connect: services.map((service) => ({
                    id: service.id,
                })),
            },
        },
        include: {
            appointment: true,
            services: true,
        },
    });

    console.log("new order", newOrder);
    if (!newOrder) {
        return res.status(404).json({ message: 'New order can not be made' });
    }

    await prisma.appointment.update({
        where: { id: appointmentId },
        data: { available: false },
    });

    res.status(200).send(newOrder);
};

export { getOrders, createOrder };