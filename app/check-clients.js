
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkClients() {
  try {
    const clientes = await prisma.cliente.findMany({
      take: 5,
      include: {
        gestor: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });
    
    console.log('Total clientes encontrados:', clientes.length);
    console.log('Primeros 5 clientes:', JSON.stringify(clientes, null, 2));
    
    // También verificar usuarios
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });
    
    console.log('\nUsuarios en el sistema:', JSON.stringify(users, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClients();
