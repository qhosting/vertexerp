import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddonManager } from '@/lib/addons/addon-manager';

// POST - Recibir pedido de la tienda online (Ecommerce) e insertarlo en el ERP
export async function POST(request: NextRequest) {
  try {
    // Nota: Esta API es pública o autenticada con API key de la tienda online
    if (!(await AddonManager.isAddonEnabled('ecommerce-store'))) {
      return NextResponse.json({ error: 'Módulo de E-commerce deshabilitado' }, { status: 403 });
    }

    const body = await request.json();
    const {
      clienteEmail,
      clienteNombre,
      clienteTelefono,
      items,
      metodoPago, // Stripe / PayPal / MercadoPago
      referenciaPago,
      total,
      observaciones
    } = body;

    // 1. Validaciones básicas
    if (!clienteEmail || !items || items.length === 0 || !total) {
      return NextResponse.json(
        { error: 'Campos requeridos: clienteEmail, items, total' },
        { status: 400 }
      );
    }

    // 2. Buscar o crear el cliente en base a su email
    let cliente = await prisma.cliente.findFirst({
      where: { email: clienteEmail }
    });

    if (!cliente) {
      // Si no existe, crear un perfil cliente genérico/nuevo para la tienda online
      const codigoCliente = 'ECO-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      cliente = await prisma.cliente.create({
        data: {
          codigoCliente,
          nombre: clienteNombre || 'Cliente Tienda Online',
          email: clienteEmail,
          telefono1: clienteTelefono || '',
          saldoActual: 0,
          limiteCredito: 0,
          status: 'ACTIVO'
        }
      });
    }

    // 3. Obtener un vendedor por defecto (ej. el administrador del e-commerce o una cuenta de sistema)
    const vendedor = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!vendedor) {
      return NextResponse.json({ error: 'No se encontró un usuario administrador en el sistema' }, { status: 500 });
    }

    // 4. Crear el pedido en la base de datos principal de la plataforma
    const folio = 'ECO-' + Date.now().toString().slice(-6);

    const nuevoPedido = await prisma.pedido.create({
      data: {
        folio,
        clienteId: cliente.id,
        vendedorId: vendedor.id,
        subtotal: total / 1.16,
        iva: total - (total / 1.16),
        total: total,
        estatus: 'PENDIENTE',
        prioridad: 'NORMAL',
        observaciones: observaciones || `Pedido Web E-commerce - Pago vía ${metodoPago} (${referenciaPago || 'Sin Ref'})`,
        detalles: {
          create: items.map((item: any) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
            subtotal: item.cantidad * item.precioUnitario
          }))
        }
      },
      include: {
        cliente: true,
        detalles: true
      }
    });

    return NextResponse.json({
      pedidoId: nuevoPedido.id,
      folio: nuevoPedido.folio,
      message: 'Pedido recibido y registrado en el ERP de manera exitosa'
    }, { status: 201 });

  } catch (error) {
    console.error('Error al registrar pedido de e-commerce:', error);
    return NextResponse.json({ error: 'Error interno del servidor al sincronizar e-commerce' }, { status: 500 });
  }
}
