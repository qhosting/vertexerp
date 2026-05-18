import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AddonManager } from '@/lib/addons/addon-manager';
import contpaqiService from '@/lib/contpaqi';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar si el módulo de facturación SAT está activo
    if (!(await AddonManager.isAddonEnabled('facturacion-sat'))) {
      return NextResponse.json({ error: 'Módulo de Facturación SAT deshabilitado' }, { status: 403 });
    }

    const body = await request.json();
    const { ventaId, usoCfdi, regimenFiscal } = body;

    if (!ventaId) {
      return NextResponse.json({ error: 'Falta parámetro ventaId' }, { status: 400 });
    }

    // 1. Obtener la venta e incluir detalles y cliente
    const venta = await prisma.venta.findUnique({
      where: { id: ventaId },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true
          }
        }
      }
    });

    if (!venta) {
      return NextResponse.json({ error: 'Venta no encontrada en la base de datos' }, { status: 404 });
    }

    // 2. Mapear y preparar el payload para la API Contpaqi (CFDI 4.0)
    const payload = {
      folio: venta.folio,
      rfcCliente: (venta.cliente as any).rfc || 'XAXX010101000', // RFC Público General si no cuenta con uno propio
      usoCfdi: usoCfdi || 'G03', // Gastos en general por defecto
      regimenFiscal: regimenFiscal || '605', // Régimen de Sueldos y Salarios por defecto
      metodoPago: venta.status === 'PAGADA' ? 'PUE' as const : 'PPD' as const, // PUE para pago único inmediato, PPD si es financiado/a plazos
      formaPago: venta.status === 'PAGADA' ? '01' : '99', // 01 Efectivo, 99 Por definir si es crédito
      items: venta.detalles.map((d) => ({
        codigoProducto: d.producto.codigo,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        subtotal: d.subtotal
      }))
    };

    // 3. Invocar al servicio Contpaqi para timbrar el documento
    const stampResult = await contpaqiService.stampInvoice(venta.id, payload);

    if (stampResult.success) {
      return NextResponse.json({
        success: true,
        message: 'CFDI 4.0 timbrado exitosamente en Contpaqi Comercial Premium',
        uuid: stampResult.uuid,
        folioFactura: stampResult.folioFactura
      });
    } else {
      return NextResponse.json({
        success: false,
        error: stampResult.error || 'Error del SDK de Contpaqi al emitir CFDI'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error en POST /api/facturacion/timbrar:', error);
    return NextResponse.json({ error: 'Error interno del servidor al procesar timbrado fiscal' }, { status: 500 });
  }
}
