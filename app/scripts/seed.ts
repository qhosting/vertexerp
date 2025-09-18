
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create test admin user with the credentials specified
  const hashedPassword = await bcrypt.hash('123456', 12);
  
  try {
    await prisma.user.upsert({
      where: { email: 'admin@sistema.com' },
      update: {},
      create: {
        email: 'admin@sistema.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Sistema',
        name: 'Admin Sistema',
        role: 'SUPERADMIN',
        isActive: true,
      },
    });
    console.log('Main admin user created/updated');

    // Create additional admin users
    const johnHashedPassword = await bcrypt.hash('johndoe123', 12);
    await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: johnHashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        role: 'SUPERADMIN',
        isActive: true,
      },
    });
    console.log('John admin user created/updated');

    // Create sample admin user for the system
    const adminHashedPassword = await bcrypt.hash('admin123', 12);
    await prisma.user.upsert({
      where: { email: 'admin@empresa.com' },
      update: {},
      create: {
        email: 'admin@empresa.com',
        password: adminHashedPassword,
        firstName: 'Admin',
        lastName: 'Empresa',
        name: 'Admin Empresa',
        role: 'SUPERADMIN',
        isActive: true,
      },
    });
    console.log('Company admin user created/updated');

    // Create additional test users with different patterns
    const patterns = [
      { email: 'gestor1@sistema.com', name: 'María Gestor', role: 'GESTOR', firstName: 'María', lastName: 'Gestor' },
      { email: 'gestor2@sistema.com', name: 'Carlos Gestor', role: 'GESTOR', firstName: 'Carlos', lastName: 'Gestor' },
      { email: 'vendedor1@sistema.com', name: 'Ana Vendedor', role: 'VENTAS', firstName: 'Ana', lastName: 'Vendedor' },
      { email: 'vendedor2@sistema.com', name: 'Luis Vendedor', role: 'VENTAS', firstName: 'Luis', lastName: 'Vendedor' },
      { email: 'analista@sistema.com', name: 'Pedro Analista', role: 'ANALISTA', firstName: 'Pedro', lastName: 'Analista' }
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
            firstName: pattern.firstName || pattern.name.split(' ')[0],
            lastName: pattern.lastName || pattern.name.split(' ').slice(1).join(' ') || 'Test',
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

    // Get gestor and vendedor users for client assignments
    const gestor = await prisma.user.findFirst({
      where: { role: 'GESTOR' }
    });
    const vendedor = await prisma.user.findFirst({
      where: { role: 'VENTAS' }
    });

    // Create sample clients
    const sampleClients = [
      {
        codigoCliente: 'CLI001',
        nombre: 'Juan Pérez García',
        telefono1: '442-555-0001',
        telefono2: '442-555-0002',
        email: 'juan.perez@email.com',
        municipio: 'Querétaro',
        estado: 'Querétaro',
        colonia: 'Centro',
        calle: 'Av. Constituyentes',
        numeroExterior: '123',
        codigoPostal: '76000',
        saldoActual: 15000,
        pagosPeriodicos: 2500,
        periodicidad: 'SEMANAL',
        status: 'ACTIVO',
        diaCobro: 'LUNES',
        gestorId: gestor?.id,
        vendedorId: vendedor?.id
      },
      {
        codigoCliente: 'CLI002',
        nombre: 'María López Hernández',
        telefono1: '442-555-0003',
        email: 'maria.lopez@email.com',
        municipio: 'Querétaro',
        estado: 'Querétaro',
        colonia: 'Del Valle',
        calle: 'Calle 5 de Mayo',
        numeroExterior: '456',
        codigoPostal: '76020',
        saldoActual: 8500,
        pagosPeriodicos: 1700,
        periodicidad: 'SEMANAL',
        status: 'ACTIVO',
        diaCobro: 'MARTES',
        gestorId: gestor?.id,
        vendedorId: vendedor?.id
      },
      {
        codigoCliente: 'CLI003',
        nombre: 'Carlos Rodríguez Martínez',
        telefono1: '442-555-0004',
        telefono2: '442-555-0005',
        email: 'carlos.rodriguez@email.com',
        municipio: 'San Juan del Río',
        estado: 'Querétaro',
        colonia: 'San Rafael',
        calle: 'Blvd. Bernardo Quintana',
        numeroExterior: '789',
        codigoPostal: '76800',
        saldoActual: 12000,
        pagosPeriodicos: 3000,
        periodicidad: 'QUINCENAL',
        status: 'MOROSO',
        diaCobro: 'MIERCOLES',
        gestorId: gestor?.id,
        vendedorId: vendedor?.id
      },
      {
        codigoCliente: 'CLI004',
        nombre: 'Ana Jiménez Torres',
        telefono1: '442-555-0006',
        email: 'ana.jimenez@email.com',
        municipio: 'Corregidora',
        estado: 'Querétaro',
        colonia: 'El Pueblito',
        calle: 'Av. Antea',
        numeroExterior: '321',
        codigoPostal: '76900',
        saldoActual: 5500,
        pagosPeriodicos: 1100,
        periodicidad: 'SEMANAL',
        status: 'ACTIVO',
        diaCobro: 'JUEVES',
        gestorId: gestor?.id,
        vendedorId: vendedor?.id
      },
      {
        codigoCliente: 'CLI005',
        nombre: 'Roberto Sánchez Morales',
        telefono1: '442-555-0007',
        telefono3: '442-555-0008',
        email: 'roberto.sanchez@email.com',
        municipio: 'El Marqués',
        estado: 'Querétaro',
        colonia: 'Zakia',
        calle: 'Paseo de la República',
        numeroExterior: '654',
        codigoPostal: '76246',
        saldoActual: 18500,
        pagosPeriodicos: 3700,
        periodicidad: 'SEMANAL',
        status: 'ACTIVO',
        diaCobro: 'VIERNES',
        gestorId: gestor?.id,
        vendedorId: vendedor?.id
      }
    ];

    for (const cliente of sampleClients) {
      try {
        await prisma.cliente.upsert({
          where: { codigoCliente: cliente.codigoCliente },
          update: {},
          create: cliente,
        });
      } catch (error) {
        console.warn(`Failed to create client ${cliente.codigoCliente}:`, error);
      }
    }
    console.log('Sample clients created/updated');

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
