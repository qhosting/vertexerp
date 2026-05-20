import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AddonManager } from '@/lib/addons/addon-manager';

// GET - Obtener productos activos y con stock para el catálogo público del E-commerce
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar si el addon de E-commerce está habilitado
    if (!(await AddonManager.isAddonEnabled('ecommerce-store'))) {
      return NextResponse.json(
        { error: 'El módulo de E-commerce está deshabilitado en la configuración general.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria') || '';
    const search = searchParams.get('search') || '';

    // 2. Construir la consulta
    const where: any = {
      isActive: true,
    };

    if (categoria) {
      where.categoria = {
        equals: categoria,
        mode: 'insensitive'
      };
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
        { marca: { contains: search, mode: 'insensitive' } },
        { modelo: { contains: search, mode: 'insensitive' } }
      ];
    }

    // 3. Consultar base de datos seleccionando solo campos públicos no sensibles
    const productos = await prisma.producto.findMany({
      where,
      select: {
        id: true,
        codigo: true,
        nombre: true,
        descripcion: true,
        categoria: true,
        marca: true,
        modelo: true,
        precio1: true, // Precio Público
        precio2: true, // Precio Mayorista
        precio3: true, // Precio Distribuidor
        etiquetaPrecio1: true,
        etiquetaPrecio2: true,
        etiquetaPrecio3: true,
        stock: true,
        imagen: true,
        imagenes: true,
        destacado: true,
        oferta: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ productos }, { status: 200 });
  } catch (error) {
    console.error('Error al consultar catálogo público:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al consultar el catálogo de productos.' },
      { status: 500 }
    );
  }
}
