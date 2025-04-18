import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: {
                order: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999)) 
                }
            },
            include: {
                services: true,
                appointment: true
            }
        }});
        console.log("Orders:", orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Server error' });
    }
}    

const createOrder = async (req, res) => {
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
                available: false,
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
      
        if(!newOrder) {
            return res.status(404).json({ message: 'New order can not be made' });
        }

        res.status(200).send(newOrder);
    }
    
};

export { getOrders, createOrder };