
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const clientes = await prisma.cliente.findMany({
      include: {
        gestor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
          }
        },
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error fetching clientes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Check permissions (simplified)
    if (!['SUPERADMIN', 'ADMIN', 'GESTOR', 'VENTAS'].includes(session.user.role)) {
      return NextResponse.json(
        { error: "No tienes permisos para crear clientes" },
        { status: 403 }
      );
    }

    const body = await req.json();
    
    // Generate next client code
    const lastCliente = await prisma.cliente.findFirst({
      orderBy: { codigoCliente: 'desc' }
    });
    
    let nextCode = 'CLI001';
    if (lastCliente?.codigoCliente) {
      const lastNumber = parseInt(lastCliente.codigoCliente.replace('CLI', ''));
      nextCode = `CLI${(lastNumber + 1).toString().padStart(3, '0')}`;
    }

    const cliente = await prisma.cliente.create({
      data: {
        ...body,
        codigoCliente: nextCode,
      },
      include: {
        gestor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            name: true,
          }
        },
      }
    });

    return NextResponse.json(cliente, { status: 201 });
  } catch (error) {
    console.error("Error creating cliente:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
