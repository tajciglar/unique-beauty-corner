import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getServices = async (req, res) => {
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
        res.json(services);
    } catch (error) {
        console.error(error);
    }
}

export { getServices };