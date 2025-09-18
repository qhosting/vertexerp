
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

    // Create additional test users with different patterns
    const patterns = [
      { email: 'user1@test.com', name: 'Test User 1', role: 'CLIENTE' },
      { email: 'user2@test.com', name: 'Test User 2', role: 'GESTOR' },
      { email: 'user3@test.com', name: 'Test User 3', role: 'VENTAS' },
      { email: 'testuser@demo.com', name: 'Demo User', role: 'CLIENTE' },
      { email: 'demo@test.local', name: 'Local Demo', role: 'ANALISTA' }
    ];

    for (const pattern of patterns) {
      const testPassword = await bcrypt.hash('password123', 12);
      try {
        await prisma.user.upsert({
          where: { email: pattern.email },
          update: {},
          create: {
            email: pattern.email,
            password: testPassword,
            name: pattern.name,
            firstName: pattern.name.split(' ')[0],
            lastName: pattern.name.split(' ').slice(1).join(' ') || 'Test',
            role: pattern.role as any,
            isActive: true,
          },
        });
        console.log(`Test user ${pattern.email} created/updated`);
      } catch (error) {
        console.warn(`Failed to create user ${pattern.email}:`, error);
      }
    }

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
