import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get("tipo") || "dashboard";
    
    // Obtener datos reales de ventas de la base de datos para incluirlos en el reporte CSV
    const ventas = await prisma.venta.findMany({
      include: {
        cliente: true
      },
      orderBy: {
        fechaVenta: 'desc'
      },
      take: 100
    });

    // Generar un CSV con datos reales de la base de datos
    let csvContent = "\ufeff"; // BOM para caracteres especiales como acentos en Excel
    csvContent += "REPORTE DE BUSINESS INTELLIGENCE - VERTEXERP\n";
    csvContent += `Tipo de Reporte: ${tipo.toUpperCase()}\n`;
    csvContent += `Fecha de Generación: ${new Date().toLocaleString()}\n\n`;
    
    csvContent += "Folio,Cliente,Total,Saldo Pendiente,Estatus,Fecha de Venta\n";
    
    if (ventas.length > 0) {
      ventas.forEach((v) => {
        const clienteNombre = v.cliente?.nombre.replace(/,/g, " ") || "Sin Cliente";
        csvContent += `${v.folio},${clienteNombre},${v.total},${v.saldoPendiente},${v.status},${v.fechaVenta.toISOString()}\n`;
      });
    } else {
      csvContent += "N/A,No hay ventas registradas en la base de datos,0,0,N/A,N/A\n";
    }

    const buffer = Buffer.from(csvContent, "utf-8");

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=reporte-bi-${tipo}-${Date.now()}.csv`,
      },
    });
  } catch (error) {
    console.error("Error al exportar reporte de BI:", error);
    return NextResponse.json(
      { error: "Error interno al exportar reporte" },
      { status: 500 }
    );
  }
}
