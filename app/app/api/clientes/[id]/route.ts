
import { NextRequest, NextResponse } from 'next/server';

// GET /api/clientes/[id] - Obtener cliente por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Datos simulados de clientes
    const clientesSimulados = {
      'cli-001': {
        id: 'cli-001',
        codigoCliente: 'DQ2207185',
        nombre: 'FERNANDO RIVERA RAMIREZ',
        telefono1: '4426056846',
        telefono2: '',
        email: 'fernando.rivera@email.com',
        municipio: 'Corregidora',
        estado: 'Querétaro',
        colonia: 'EL JARAL',
        calle: 'EL JARAL',
        numeroExterior: 'SN',
        numeroInterior: '',
        codigoPostal: '76900',
        saldoActual: 5962,
        pagosPeriodicos: 1071,
        periodicidad: 'QUINCENAL',
        status: 'ACTIVO',
        diaCobro: 'SABADO',
        fechaAlta: '2022-07-18T10:30:00.000Z',
        observaciones: 'Cliente regular de cobranza quincenal',
        gestor: { firstName: 'Bot', lastName: 'DQ' },
        vendedor: { firstName: 'Ventas', lastName: 'Sistema' },
        ultimosPagos: [
          {
            fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            monto: 1071,
            concepto: 'Pago quincenal'
          },
          {
            fecha: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            monto: 1071,
            concepto: 'Pago quincenal'
          }
        ]
      },
      'cli-002': {
        id: 'cli-002',
        codigoCliente: 'DQ2209197',
        nombre: 'VICTORIA RAMOS MONTOYA',
        telefono1: '4425554623',
        telefono2: '',
        email: 'victoria.ramos@email.com',
        municipio: 'El Marqués',
        estado: 'Querétaro',
        colonia: 'HDA LA CRUZ',
        calle: 'SIERRA DE LAS CRUCES',
        numeroExterior: '5',
        numeroInterior: '25',
        codigoPostal: '76240',
        saldoActual: 22381.01,
        pagosPeriodicos: 1320,
        periodicidad: 'MENSUAL',
        status: 'ACTIVO',
        diaCobro: 'SABADO',
        fechaAlta: '2022-09-19T14:15:00.000Z',
        observaciones: 'Cliente con pago mensual alto',
        gestor: { firstName: 'Bot', lastName: 'DQ' },
        vendedor: { firstName: 'Ventas', lastName: 'Sistema' },
        ultimosPagos: [
          {
            fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            monto: 1320,
            concepto: 'Pago mensual'
          }
        ]
      },
      'cli-003': {
        id: 'cli-003',
        codigoCliente: 'DQ2301139',
        nombre: 'LILIA BOTELLO LOPEZ',
        telefono1: '7297521774',
        telefono2: '',
        email: 'lilia.botello@email.com',
        municipio: 'San Juan del Río',
        estado: 'Querétaro',
        colonia: 'CENTRO',
        calle: 'IGNACIO ZARAGOZA',
        numeroExterior: '45A',
        numeroInterior: '',
        codigoPostal: '76800',
        saldoActual: 1493.01,
        pagosPeriodicos: 120,
        periodicidad: 'SEMANAL',
        status: 'ACTIVO',
        diaCobro: 'VIERNES',
        fechaAlta: '2023-01-13T09:45:00.000Z',
        observaciones: 'Cliente con pago semanal pequeño',
        gestor: { firstName: 'Bot', lastName: 'DQ' },
        vendedor: { firstName: 'Ventas', lastName: 'Sistema' },
        ultimosPagos: [
          {
            fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            monto: 120,
            concepto: 'Pago semanal'
          },
          {
            fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            monto: 120,
            concepto: 'Pago semanal'
          }
        ]
      }
    };

    const cliente = clientesSimulados[params.id as keyof typeof clientesSimulados];

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente);
  } catch (error) {
    console.error('Error fetching cliente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/clientes/[id] - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // En un sistema real, aquí actualizarías en la base de datos
    // Por ahora solo simulamos la respuesta exitosa
    const updatedCliente = {
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedCliente);
  } catch (error) {
    console.error('Error updating cliente:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el cliente' },
      { status: 500 }
    );
  }
}

// DELETE /api/clientes/[id] - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // En un sistema real, aquí verificarías y eliminarías/desactivarías el cliente
    // Por ahora solo simulamos la respuesta exitosa
    
    return NextResponse.json({ 
      message: 'Cliente eliminado exitosamente',
      id: params.id
    });
  } catch (error) {
    console.error('Error deleting cliente:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el cliente' },
      { status: 500 }
    );
  }
}
