import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getServices = async (req, res) => {
    try {
        const services = await prisma.serviceCategory.findMany({
            include: {
                services: true,
            },
        });

        const formattedServices = services.map(category => ({
            ...category,
            services: category.services.map(service => ({
                ...service,
                servicePrice: service.servicePrice.toNumber(), // 👈 convert Decimal to number
            })),
        }));

        res.json(formattedServices);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { getServices };