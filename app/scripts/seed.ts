
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test admin user
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  try {
    await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        role: 'SUPERADMIN',
        isActive: true,
      },
    });
    console.log('Test admin user created/updated');

    // Create sample admin user for the system
    const adminHashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.upsert({
      where: { email: 'admin@empresa.com' },
      update: {},
      create: {
        email: 'admin@empresa.com',
        password: adminHashedPassword,
        firstName: 'Admin',
        lastName: 'Sistema',
        name: 'Admin Sistema',
        role: 'SUPERADMIN',
        isActive: true,
      },
    });
    console.log('System admin user created/updated');

    // Create sample configuration
    await prisma.configuracion.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        nombreEmpresa: 'Sistema ERP Completo',
        colorPrimario: '#3B82F6',
        colorSecundario: '#10B981',
        direccion: 'Av. Principal 123, Ciudad',
        telefono: '442-123-4567',
        email: 'contacto@empresa.com',
        rfc: 'EMP123456789',
      },
    });
    console.log('System configuration created/updated');

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
