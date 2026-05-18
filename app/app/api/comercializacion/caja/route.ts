import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AddonManager } from '@/lib/addons/addon-manager';

// GET - Verificar el estado de la caja actual (abierta/cerrada)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar si el addon está habilitado
    if (!(await AddonManager.isAddonEnabled('comercializacion-pos'))) {
      return NextResponse.json({ error: 'Módulo de Punto de Venta deshabilitado' }, { status: 403 });
    }

    // Simular estado de caja para demostración de comercialización de Pymes
    const estadoCaja = {
      cajaAbierta: true,
      usuarioApertura: session.user.email,
      fechaApertura: new Date(new Date().setHours(new Date().getHours() - 6)).toISOString(),
      saldoInicial: 1500.00,
      ventasEfectivo: 4850.50,
      ventasTarjeta: 3200.00,
      ventasTransferencia: 1200.00,
      egresosCaja: 350.00, // egresos autorizados (ej. caja chica)
      saldoEsperado: 1500.00 + 4850.50 - 350.00, // 5900.50
      corteEfectuado: false
    };

    return NextResponse.json({
      estadoCaja,
      message: 'Estado de caja obtenido exitosamente'
    });

  } catch (error) {
    console.error('Error en GET /api/comercializacion/caja:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// POST - Abrir o realizar Arqueo / Corte de Caja
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    if (!(await AddonManager.isAddonEnabled('comercializacion-pos'))) {
      return NextResponse.json({ error: 'Módulo de Punto de Venta deshabilitado' }, { status: 403 });
    }

    const body = await request.json();
    const { accion, saldoInicial, montoRealEfectivo, observaciones } = body;

    if (accion === 'apertura') {
      return NextResponse.json({
        message: 'Caja abierta exitosamente',
        caja: {
          id: Math.random().toString(36).substr(2, 9),
          saldoInicial: saldoInicial || 1000.00,
          fechaApertura: new Date().toISOString(),
          cajaAbierta: true
        }
      }, { status: 201 });
    }

    if (accion === 'corte') {
      const saldoEsperado = 6000.50;
      const diferencia = (montoRealEfectivo || 6000.50) - saldoEsperado;

      return NextResponse.json({
        message: 'Corte de caja efectuado con éxito',
        resumenCorte: {
          id: Math.random().toString(36).substr(2, 9),
          fechaCorte: new Date().toISOString(),
          saldoEsperado,
          efectivoReportado: montoRealEfectivo || 6000.50,
          diferencia,
          estado: diferencia === 0 ? 'CUADRADO' : diferencia > 0 ? 'SOBRANTE' : 'FALTANTE',
          observaciones: observaciones || 'Corte diario sin novedad'
        }
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'Acción no válida. Valores soportados: apertura, corte' }, { status: 400 });

  } catch (error) {
    console.error('Error en POST /api/comercializacion/caja:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
