import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddonManager } from '@/lib/addons/addon-manager';

// POST - Recibir solicitud de cotización B2B desde la tienda online y crear un Prospecto en el CRM
export async function POST(request: NextRequest) {
  try {
    // 1. Validar addons activos
    if (!(await AddonManager.isAddonEnabled('ecommerce-store'))) {
      return NextResponse.json({ error: 'Módulo de E-commerce deshabilitado' }, { status: 403 });
    }

    const body = await request.json();
    const {
      clienteNombre,
      clienteEmail,
      clienteTelefono,
      empresa,
      items,
      notas
    } = body;

    // 2. Validaciones básicas
    if (!clienteNombre || !clienteEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Campos requeridos: clienteNombre, clienteEmail, items' },
        { status: 400 }
      );
    }

    // 3. Obtener un vendedor por defecto (ej. primer Superadmin o Admin disponible)
    const vendedor = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    });

    // 4. Calcular el valor estimado de la cotización
    let valorEstimado = 0;
    const itemsDetalles = [];

    for (const item of items) {
      const precio = parseFloat(item.precioUnitario) || 0;
      const cant = parseInt(item.cantidad) || 1;
      valorEstimado += precio * cant;

      // Obtener el nombre del producto si está disponible
      let nombreProducto = 'Producto';
      if (item.productoId) {
        const prod = await prisma.producto.findUnique({
          where: { id: item.productoId },
          select: { nombre: true, codigo: true }
        });
        if (prod) {
          nombreProducto = `${prod.nombre} (${prod.codigo})`;
        }
      }
      itemsDetalles.push(`- ${nombreProducto}: ${cant} x $${precio.toLocaleString('es-MX', { minimumFractionDigits: 2 })} = $${(precio * cant).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);
    }

    // 5. Construir descripción detallada
    const descripcionCotizacion = `
SOLICITUD DE COTIZACIÓN COMERCIAL (WEB B2B)
------------------------------------------
Empresa: ${empresa || 'Particular'}
Contacto: ${clienteNombre}
Email: ${clienteEmail}
Teléfono: ${clienteTelefono || 'No proporcionado'}

Productos solicitados:
${itemsDetalles.join('\n')}

Monto Estimado: $${valorEstimado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
Notas del Cliente: ${notas || 'Ninguna'}
`.trim();

    // 6. Crear el Prospecto en la base de datos
    const nuevoProspecto = await prisma.prospecto.create({
      data: {
        nombre: clienteNombre,
        empresa: empresa || null,
        email: clienteEmail,
        telefono: clienteTelefono || null,
        valorEstimado,
        status: 'NUEVO',
        prioridad: 'MEDIA',
        origen: 'Web Storefront (Cotizador B2B)',
        notas: descripcionCotizacion,
        vendedorId: vendedor?.id || null,
        actividades: {
          create: {
            tipo: 'NOTA',
            titulo: 'Solicitud de Cotización Creada',
            descripcion: `Se recibió una solicitud de cotización web por un valor estimado de $${valorEstimado.toLocaleString('es-MX', { minimumFractionDigits: 2 })}.`,
            completada: true,
            fechaCompletada: new Date()
          }
        }
      },
      include: {
        actividades: true
      }
    });

    return NextResponse.json({
      prospectoId: nuevoProspecto.id,
      nombre: nuevoProspecto.nombre,
      valorEstimado: nuevoProspecto.valorEstimado,
      message: 'Solicitud de cotización recibida de forma exitosa y registrada como lead de ventas'
    }, { status: 201 });

  } catch (error) {
    console.error('Error al procesar solicitud de cotización:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar su solicitud de cotización.' },
      { status: 500 }
    );
  }
}
