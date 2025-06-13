import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getAppointments = async (req, res) => {
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
                order: {
                    include: {
                        services: true,
                    }
                }
            },
        });
       
        res.status(200).json({availableAppointments, bookedAppointments});
    } catch (error) {
        console.error("Error fetching termini:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getAvailableAppointments = async (req, res) => {
    const { date } = req.query;

    try {
       
        const availableAppointments = await prisma.appointment.findMany({
            where: {
            date: date,
            available: true,
            },
            orderBy: {
                startTime: 'asc',
            }
        });

        res.status(200).json(availableAppointments);
    } catch (error) {
        console.error("Error fetching available appointments:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

const createAppointment = async (req, res) => {
    const appointment = req.body;

    let newAppointment;
   
    const checkAppointment = await prisma.appointment.findFirst({
        where: {date: appointment.date, startTime: appointment.startTime}
    })

    if (checkAppointment) {
        return res.status(400).json({ message: 'Termin že zaseden' });
    }

    if (appointment.order) {
        newAppointment = await prisma.appointment.create({
            data: {
                date: appointment.date,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                available: appointment.available,
                order: {
                    create: {
                        name: appointment.order.name,
                        email: appointment.order.email,
                        phone: appointment.order.phone,
                        price: appointment.order.price,
                        duration: appointment.order.duration,
                        services: {
                            connect: appointment.order.services.map((service) => ({
                                id: service.id,  
                            }))
                        }
                    }
                },
            },
            include: {
                    order: {
                        include: {
                            services: true,
                        }
                    }
            }
        });

    } else {
        newAppointment = await prisma.appointment.create({
            data: {
                date: appointment.date,
                startTime: appointment.startTime,
                endTime: appointment.endTime,
                available: appointment.available,
            }
        });
    }
    res.json({ message: 'New appointment added',  newAppointment});
    console.log("New appointment added:", newAppointment);
}

const updateAppointment = async (req, res) => {
    console.log(req)
};

const deleteAppointment = async (req, res) => {
    const appointmentId = Number(req.params.id);

    if (!appointmentId) {
        return res.status(400).json({ message: 'Appointment ID is required' });
    }

    try {
        // First, delete the related order if it exists
        await prisma.order.deleteMany({
            where: {
                appointmentId: appointmentId,
            }
        });

        // Then, delete the appointment
        const deletedAppointment = await prisma.appointment.delete({
            where: {
                id: appointmentId,
            }
        });

        res.status(200).json({ message: 'Appointment deleted', deletedAppointment });

    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { getAppointments, createAppointment, deleteAppointment, getAvailableAppointments, updateAppointment };