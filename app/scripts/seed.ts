
import { PrismaClient, UserRole, StatusCliente, Periodicidad, StatusVenta, TipoPago } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding de la base de datos...');

  try {
    // 1. Crear configuración de marca blanca
    await prisma.configuracion.upsert({
      where: { id: 'default' },
      update: {},
      create: {
        id: 'default',
        nombreEmpresa: 'Muebles Daso',
        colorPrimario: '#3B82F6',
        colorSecundario: '#10B981',
        direccion: 'Calle Principal #123, Querétaro, México',
        telefono: '442-123-4567',
        email: 'info@mueblesdaso.com',
        rfc: 'MDA123456789',
        configJson: {
          moneda: 'MXN',
          idioma: 'es',
          timezone: 'America/Mexico_City',
        },
      },
    });

    // 2. Crear usuarios del sistema
    const hashedPassword = await bcrypt.hash('johndoe123', 12);

    const testUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        role: 'SUPERADMIN',
        phone: '442-123-4567',
        sucursal: 'MATRIZ',
        isActive: true,
      },
    });

    // Crear otros usuarios de ejemplo
    const users = [
      {
        email: 'admin@sistema.com',
        password: await bcrypt.hash('admin123', 12),
        firstName: 'Ana',
        lastName: 'Martínez',
        name: 'Ana Martínez',
        role: 'ADMIN' as UserRole,
        phone: '442-234-5678',
        sucursal: 'MATRIZ',
      },
      {
        email: 'gestor@sistema.com',
        password: await bcrypt.hash('gestor123', 12),
        firstName: 'Carlos',
        lastName: 'García',
        name: 'Carlos García',
        role: 'GESTOR' as UserRole,
        phone: '442-345-6789',
        sucursal: 'SUCURSAL_1',
      },
      {
        email: 'ventas@sistema.com',
        password: await bcrypt.hash('ventas123', 12),
        firstName: 'Laura',
        lastName: 'López',
        name: 'Laura López',
        role: 'VENTAS' as UserRole,
        phone: '442-456-7890',
        sucursal: 'SUCURSAL_1',
      },
      {
        email: 'analista@sistema.com',
        password: await bcrypt.hash('analista123', 12),
        firstName: 'Pedro',
        lastName: 'Ramírez',
        name: 'Pedro Ramírez',
        role: 'ANALISTA' as UserRole,
        phone: '442-567-8901',
        sucursal: 'MATRIZ',
      },
    ];

    const createdUsers = [];
    for (const user of users) {
      const createdUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      });
      createdUsers.push(createdUser);
    }

    // 3. Crear proveedores
    const proveedores = [
      {
        codigo: 'PROV001',
        nombre: 'Industrias del Mueble SA',
        contacto: 'Juan Pérez',
        telefono: '442-111-2222',
        email: 'ventas@industriasmueble.com',
        direccion: 'Av. Industrial #456, Querétaro',
        rfc: 'IMS123456789',
        diasCredito: 30,
        limiteCredito: 50000,
      },
      {
        codigo: 'PROV002',
        nombre: 'Distribuidora de Electrodomésticos',
        contacto: 'María González',
        telefono: '442-222-3333',
        email: 'compras@distrelec.com',
        direccion: 'Blvd. Comercial #789, Querétaro',
        rfc: 'DEL987654321',
        diasCredito: 15,
        limiteCredito: 75000,
      },
    ];

    const createdProveedores = [];
    for (const proveedor of proveedores) {
      const created = await prisma.proveedor.upsert({
        where: { codigo: proveedor.codigo },
        update: {},
        create: proveedor,
      });
      createdProveedores.push(created);
    }

    // 4. Crear productos
    const productos = [
      {
        codigo: 'COLCH001',
        nombre: 'Colchón Queen Lester Rowan',
        descripcion: 'Colchón matrimonial de alta calidad',
        categoria: 'COLCHONES',
        marca: 'LESTER',
        modelo: 'ROWAN',
        precioVenta: 8990,
        precioCompra: 6500,
        stock: 25,
        stockMinimo: 5,
        unidadMedida: 'PZA',
      },
      {
        codigo: 'COLCH002',
        nombre: 'Colchón KS America Embassy',
        descripcion: 'Colchón king size premium',
        categoria: 'COLCHONES',
        marca: 'AMERICA',
        modelo: 'EMBASSY',
        precioVenta: 13990,
        precioCompra: 10200,
        stock: 15,
        stockMinimo: 3,
        unidadMedida: 'PZA',
      },
      {
        codigo: 'BOX001',
        nombre: 'Box Mat Lester',
        descripcion: 'Base para colchón matrimonial',
        categoria: 'BOXES',
        marca: 'LESTER',
        modelo: 'STANDARD',
        precioVenta: 4990,
        precioCompra: 3500,
        stock: 30,
        stockMinimo: 8,
        unidadMedida: 'PZA',
      },
      {
        codigo: 'REFRI001',
        nombre: 'Refrigerador 14 pies',
        descripcion: 'Refrigerador de 14 pies cúbicos',
        categoria: 'ELECTRODOMESTICOS',
        marca: 'WHIRLPOOL',
        modelo: 'WT4514',
        precioVenta: 22990,
        precioCompra: 18000,
        stock: 8,
        stockMinimo: 2,
        unidadMedida: 'PZA',
      },
      {
        codigo: 'ESTUFA001',
        nombre: 'Estufa 4 Quemadores',
        descripcion: 'Estufa de gas 4 quemadores',
        categoria: 'ELECTRODOMESTICOS',
        marca: 'WHIRLPOOL',
        modelo: 'WG4Q',
        precioVenta: 7990,
        precioCompra: 5800,
        stock: 12,
        stockMinimo: 3,
        unidadMedida: 'PZA',
      },
    ];

    const createdProductos = [];
    for (const producto of productos) {
      const created = await prisma.producto.upsert({
        where: { codigo: producto.codigo },
        update: {},
        create: producto,
      });
      createdProductos.push(created);
    }

    // 5. Crear clientes basados en los datos originales
    const clientes = [
      {
        codigoCliente: 'DQ2207185',
        contrato: '33802',
        nombre: 'FERNANDO RIVERA RAMIREZ',
        telefono1: '4426056846',
        calle: 'EL JARAL',
        numeroExterior: 'SN',
        colonia: 'EL JARAL',
        municipio: 'Corregidora',
        estado: 'Querétaro',
        codigoPostal: '76926',
        saldoActual: 5962,
        pagosPeriodicos: 1071,
        periodicidad: 'QUINCENAL' as Periodicidad,
        diaCobro: 'SABADO',
        empleo: 'RIVAN CARNICERIA DUEÑO',
        gestorId: createdUsers[1]?.id, // Gestor
        vendedorId: createdUsers[2]?.id, // Ventas
        status: 'ACTIVO' as StatusCliente,
      },
      {
        codigoCliente: 'DQ2209197',
        contrato: '34697',
        nombre: 'VICTORIA RAMOS MONTOYA',
        telefono1: '4425554623',
        calle: 'SIERRA DE LAS CRUCES',
        numeroExterior: '5',
        numeroInterior: '25',
        colonia: 'HDA LA CRUZ',
        municipio: 'El Marqués',
        estado: 'Querétaro',
        codigoPostal: '76240',
        saldoActual: 22381.01,
        pagosPeriodicos: 1320,
        periodicidad: 'MENSUAL' as Periodicidad,
        diaCobro: 'SABADO',
        empleo: 'MABE EMPLEADA',
        gestorId: createdUsers[1]?.id,
        vendedorId: createdUsers[2]?.id,
        status: 'ACTIVO' as StatusCliente,
      },
      {
        codigoCliente: 'DQ2301139',
        contrato: '35750',
        nombre: 'LILIA BOTELLO LOPEZ',
        telefono1: '7297521774',
        calle: 'IGNACIO ZARAGOZA',
        numeroExterior: '45A',
        colonia: 'CENTRO',
        municipio: 'San Juan del Río',
        estado: 'Querétaro',
        codigoPostal: '76800',
        saldoActual: 1493.01,
        pagosPeriodicos: 120,
        periodicidad: 'SEMANAL' as Periodicidad,
        diaCobro: 'VIERNES',
        empleo: 'VTA DE COMIDA IGNACIO ZARAGOZA 45 A CENTRO SJR',
        gestorId: createdUsers[1]?.id,
        vendedorId: createdUsers[2]?.id,
        status: 'ACTIVO' as StatusCliente,
      },
      {
        codigoCliente: 'DQ2302128',
        contrato: '36037',
        nombre: 'JOSE LUIS HERNANDEZ BOTELLO',
        telefono1: '4481112364',
        calle: 'AV HIDALGO',
        numeroExterior: 'SN',
        colonia: 'SAN FANDILA',
        municipio: 'PEDRO ESCOBEDO',
        estado: 'Querétaro',
        codigoPostal: '76204',
        saldoActual: 1460.01,
        pagosPeriodicos: 215,
        periodicidad: 'SEMANAL' as Periodicidad,
        diaCobro: 'MARTES',
        empleo: 'MADERERIA INSTITUTO MEX DEL TRANSPORTE SN SAN FAND',
        gestorId: createdUsers[1]?.id,
        vendedorId: createdUsers[2]?.id,
        status: 'ACTIVO' as StatusCliente,
      },
    ];

    const createdClientes = [];
    for (const cliente of clientes) {
      const created = await prisma.cliente.upsert({
        where: { codigoCliente: cliente.codigoCliente },
        update: {},
        create: cliente,
      });
      createdClientes.push(created);
    }

    // 6. Crear ventas de ejemplo
    const ventas = [
      {
        numeroVenta: 'V-2025-001',
        clienteId: createdClientes[0]?.id || '',
        vendedorId: createdUsers[2]?.id || '',
        subtotal: 8990,
        iva: 1438.4,
        total: 10428.4,
        anticipo: 1000,
        saldo: 9428.4,
        periodicidadPago: 'QUINCENAL' as Periodicidad,
        numeroPagos: 10,
        montoPago: 1071,
        status: 'CONFIRMADA' as StatusVenta,
        observaciones: 'Venta de colchón matrimonial con box',
      },
      {
        numeroVenta: 'V-2025-002',
        clienteId: createdClientes[1]?.id || '',
        vendedorId: createdUsers[2]?.id || '',
        subtotal: 22990,
        iva: 3678.4,
        total: 26668.4,
        anticipo: 2000,
        saldo: 24668.4,
        periodicidadPago: 'MENSUAL' as Periodicidad,
        numeroPagos: 18,
        montoPago: 1320,
        status: 'CONFIRMADA' as StatusVenta,
        observaciones: 'Venta de refrigerador 14 pies',
      },
    ];

    const createdVentas = [];
    for (const venta of ventas) {
      if (venta.clienteId) {
        const created = await prisma.venta.upsert({
          where: { numeroVenta: venta.numeroVenta },
          update: {},
          create: venta,
        });
        createdVentas.push(created);
      }
    }

    // 7. Crear items de venta
    if (createdVentas.length > 0 && createdProductos.length > 0) {
      await prisma.ventaItem.createMany({
        data: [
          {
            ventaId: createdVentas[0]?.id || '',
            productoId: createdProductos[0]?.id || '',
            cantidad: 1,
            precioUnitario: 8990,
            subtotal: 8990,
          },
          {
            ventaId: createdVentas[1]?.id || '',
            productoId: createdProductos[3]?.id || '',
            cantidad: 1,
            precioUnitario: 22990,
            subtotal: 22990,
          },
        ],
        skipDuplicates: true,
      });
    }

    // 8. Crear pagos de ejemplo
    const pagos = [
      {
        clienteId: createdClientes[0]?.id || '',
        ventaId: createdVentas[0]?.id,
        gestorId: createdUsers[1]?.id,
        referencia: 'Pago quincenal',
        monto: 1071,
        tipoPago: 'EFECTIVO' as TipoPago,
        fechaPago: new Date(),
        fechaHora: new Date(),
        latitud: '20.5888',
        longitud: '-100.3899',
        sucursal: 'MATRIZ',
        verificado: true,
        sincronizado: true,
      },
      {
        clienteId: createdClientes[1]?.id || '',
        ventaId: createdVentas[1]?.id,
        gestorId: createdUsers[1]?.id,
        referencia: 'Pago mensual',
        monto: 1320,
        tipoPago: 'TRANSFERENCIA' as TipoPago,
        fechaPago: new Date(),
        fechaHora: new Date(),
        latitud: '20.5888',
        longitud: '-100.3899',
        sucursal: 'SUCURSAL_1',
        verificado: true,
        sincronizado: true,
      },
    ];

    for (const pago of pagos) {
      if (pago.clienteId) {
        await prisma.pago.create({
          data: pago,
        });
      }
    }

    console.log('✅ Seeding completado exitosamente');
    console.log(`👤 Usuarios creados: ${createdUsers.length + 1}`);
    console.log(`🏪 Proveedores creados: ${createdProveedores.length}`);
    console.log(`📦 Productos creados: ${createdProductos.length}`);
    console.log(`👥 Clientes creados: ${createdClientes.length}`);
    console.log(`💰 Ventas creadas: ${createdVentas.length}`);
    console.log('');
    console.log('🔑 Usuario de prueba:');
    console.log('   Email: john@doe.com');
    console.log('   Password: johndoe123');
    console.log('   Rol: SUPERADMIN');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
    throw error;
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
