
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/test-client/[id] - Obtener cliente por ID sin autenticación
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: params.id },
      include: {
        gestor: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        pagos: {
          take: 5,
          orderBy: { fechaPago: 'desc' },
          select: {
            id: true,
            monto: true,
            fechaPago: true,
            referencia: true,
            tipoPago: true
          }
        }
      }
    });

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    // Formatear la respuesta
    const clienteConPagos = {
      ...cliente,
      ultimosPagos: cliente.pagos?.map((pago: any) => ({
        fecha: pago.fechaPago.toISOString(),
        monto: pago.monto,
        concepto: pago.referencia || 'Pago',
        metodoPago: pago.tipoPago
      })) || []
    };

    return NextResponse.json(clienteConPagos);
  } catch (error) {
    console.error('Error fetching cliente:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error },
      { status: 500 }
    );
  }
}

// PUT /api/test-client/[id] - Actualizar cliente sin autenticación
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      nombre,
      telefono1,
      telefono2,
      email,
      municipio,
      estado,
      colonia,
      calle,
      numeroExterior,
      numeroInterior,
      codigoPostal,
      pagosPeriodicos,
      periodicidad,
      status,
      diaCobro,
      gestorId,
      vendedorId,
    } = body;

    // Verificar que el cliente existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: params.id }
    });

    if (!clienteExistente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    const updatedCliente = await prisma.cliente.update({
      where: { id: params.id },
      data: {
        nombre: nombre?.trim(),
        telefono1: telefono1?.trim(),
        telefono2: telefono2?.trim() || null,
        email: email?.trim() || null,
        municipio: municipio?.trim() || null,
        estado: estado?.trim() || null,
        colonia: colonia?.trim() || null,
        calle: calle?.trim() || null,
        numeroExterior: numeroExterior?.trim() || null,
        numeroInterior: numeroInterior?.trim() || null,
        codigoPostal: codigoPostal?.trim() || null,
        pagosPeriodicos: typeof pagosPeriodicos === 'number' ? pagosPeriodicos : parseFloat(pagosPeriodicos) || 0,
        periodicidad: periodicidad || 'SEMANAL',
        status: status || 'ACTIVO',
        diaCobro: diaCobro || null,
        gestorId: gestorId || null,
        vendedorId: vendedorId || null,
        ultimaActualizacion: new Date()
      },
      include: {
        gestor: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      cliente: updatedCliente,
      message: 'Cliente actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating cliente:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el cliente', details: error },
      { status: 500 }
    );
  }
}
