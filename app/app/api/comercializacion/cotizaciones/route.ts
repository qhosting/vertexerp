import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AddonManager } from '@/lib/addons/addon-manager';

// GET - Listar cotizaciones activas o consultar una cotización específica
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!(await AddonManager.isAddonEnabled('presupuestos-cotizaciones'))) {
      return NextResponse.json({ error: 'Módulo de Cotizaciones y Presupuestos deshabilitado' }, { status: 403 });
    }

    // Datos simulados estructurados de cotizaciones para Pymes de comercialización
    const cotizaciones = [
      {
        id: 'cot_1289',
        folio: 'COT-2026-0045',
        cliente: 'Comercializadora del Centro S.A.',
        vendedor: session.user.name || 'Vendedor del Sistema',
        fechaCreacion: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        fechaExpiracion: new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(),
        subtotal: 12500.00,
        iva: 2000.00,
        total: 14500.00,
        estatus: 'ENVIADA',
        items: [
          { producto: 'Laptop Core i5', cantidad: 1, precioUnitario: 11000.00, subtotal: 11000.00 },
          { producto: 'Mouse Inalámbrico', cantidad: 5, precioUnitario: 300.00, subtotal: 1500.00 }
        ]
      },
      {
        id: 'cot_1290',
        folio: 'COT-2026-0046',
        cliente: 'Abarrotes La Principal',
        vendedor: session.user.name || 'Vendedor del Sistema',
        fechaCreacion: new Date().toISOString(),
        fechaExpiracion: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
        subtotal: 4200.00,
        iva: 672.00,
        total: 4872.00,
        estatus: 'BORRADOR',
        items: [
          { producto: 'Caja Aceite Multiusos 1L', cantidad: 10, precioUnitario: 420.00, subtotal: 4200.00 }
        ]
      }
    ];

    return NextResponse.json({
      cotizaciones,
      message: 'Cotizaciones obtenidas exitosamente'
    });

  } catch (error) {
    console.error('Error en GET /api/comercializacion/cotizaciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Crear cotización o convertir una cotización existente en Pedido / Venta
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!(await AddonManager.isAddonEnabled('presupuestos-cotizaciones'))) {
      return NextResponse.json({ error: 'Módulo de Cotizaciones y Presupuestos deshabilitado' }, { status: 403 });
    }

    const body = await request.json();
    const { accion, cotizacionId, clienteId, items, diasValidez } = body;

    // Acción de Conversión (Cotización -> Pedido / Venta)
    if (accion === 'convertir') {
      if (!cotizacionId) {
        return NextResponse.json({ error: 'Se requiere cotizacionId para la conversión' }, { status: 400 });
      }

      // Simular conversión a Pedido del ERP
      const folioPedido = 'PED-' + Date.now().toString().slice(-6);
      return NextResponse.json({
        message: '¡Cotización convertida en Pedido con éxito!',
        pedidoId: Math.random().toString(36).substr(2, 9),
        folioPedido,
        convertidoPor: session.user.email,
        fechaConversion: new Date().toISOString()
      }, { status: 201 });
    }

    // Acción de Crear Cotización Nueva
    const folioCotizacion = 'COT-' + Date.now().toString().slice(-6);
    const validez = diasValidez || 15;
    const fechaExpiracion = new Date();
    fechaExpiracion.setDate(fechaExpiracion.getDate() + validez);

    return NextResponse.json({
      message: 'Cotización creada exitosamente',
      cotizacion: {
        id: Math.random().toString(36).substr(2, 9),
        folio: folioCotizacion,
        clienteId: clienteId || 'temp_client_id',
        fechaCreacion: new Date().toISOString(),
        fechaExpiracion: fechaExpiracion.toISOString(),
        items: items || [],
        estatus: 'ENVIADA'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error en POST /api/comercializacion/cotizaciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
