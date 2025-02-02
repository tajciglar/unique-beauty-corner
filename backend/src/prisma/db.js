import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

testConnection();

export default prisma;
