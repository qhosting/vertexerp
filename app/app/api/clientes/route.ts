
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Simulación de conexión a base de datos MySQL
const dbConfig = {
  host: 'localhost',
  user: 'mueblesdaso_cob',
  password: 'B4Dl6VlHDo',
  database: 'mueblesdaso_cob'
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const codigoGestor = searchParams.get('codigo_gestor');
    
    if (!codigoGestor) {
      return NextResponse.json(
        { error: 'Código de gestor requerido' },
        { status: 400 }
      );
    }

    // Aquí iría la consulta real a MySQL
    // const mysql = require('mysql2/promise');
    // const connection = await mysql.createConnection(dbConfig);
    // const query = `
    //   SELECT 
    //     cod_cliente, nombre_ccliente, codigo_gestor, periodicidad_cliente,
    //     pagos_cliente, calle_dom, exterior_dom, interior_dom, colonia_dom,
    //     municipio_dom, tel1_cliente, saldo_actualcli, dia_cobro,
    //     semv, semdv, lat_dom, long_dom
    //   FROM cat_clientes 
    //   WHERE codigo_gestor = ? AND pagar = 0
    //   ORDER BY nombre_ccliente
    // `;
    // const [rows] = await connection.execute(query, [codigoGestor]);
    // await connection.end();

    // Por ahora devolvemos datos de ejemplo basados en el SQL proporcionado
    // Convertimos el formato para que coincida con la interfaz Cliente del frontend
    const clientesEjemplo = [
      {
        id: 'cli-001',
        codigoCliente: 'DQ2207185',
        nombre: 'FERNANDO RIVERA RAMIREZ',
        telefono1: '4426056846',
        municipio: 'Corregidora',
        estado: 'Querétaro',
        saldoActual: 5962,
        pagosPeriodicos: 1071,
        periodicidad: 'QUINCENAL',
        status: 'ACTIVO',
        diaCobro: 'SABADO',
        gestor: { firstName: 'Bot', lastName: 'DQ' },
        vendedor: { firstName: 'Ventas', lastName: 'Sistema' }
      },
      {
        id: 'cli-002',
        codigoCliente: 'DQ2209197',
        nombre: 'VICTORIA RAMOS MONTOYA',
        telefono1: '4425554623',
        municipio: 'El Marqués',
        estado: 'Querétaro',
        saldoActual: 22381.01,
        pagosPeriodicos: 1320,
        periodicidad: 'MENSUAL',
        status: 'ACTIVO',
        diaCobro: 'SABADO',
        gestor: { firstName: 'Bot', lastName: 'DQ' },
        vendedor: { firstName: 'Ventas', lastName: 'Sistema' }
      },
      {
        id: 'cli-003',
        codigoCliente: 'DQ2301139',
        nombre: 'LILIA BOTELLO LOPEZ',
        telefono1: '7297521774',
        municipio: 'San Juan del Río',
        estado: 'Querétaro',
        saldoActual: 1493.01,
        pagosPeriodicos: 120,
        periodicidad: 'SEMANAL',
        status: 'ACTIVO',
        diaCobro: 'VIERNES',
        gestor: { firstName: 'Bot', lastName: 'DQ' },
        vendedor: { firstName: 'Ventas', lastName: 'Sistema' }
      }
    ];

    return NextResponse.json(clientesEjemplo, { status: 200 });
    
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

// Endpoint para buscar cliente específico
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { cod_cliente } = await request.json();
    
    if (!cod_cliente) {
      return NextResponse.json(
        { error: 'Código de cliente requerido' },
        { status: 400 }
      );
    }

    // Aquí iría la consulta específica por código de cliente
    // const mysql = require('mysql2/promise');
    // const connection = await mysql.createConnection(dbConfig);
    // const query = `
    //   SELECT * FROM cat_clientes WHERE cod_cliente = ?
    // `;
    // const [rows] = await connection.execute(query, [cod_cliente]);
    // await connection.end();

    // Simular búsqueda de cliente específico
    const cliente = {
      cod_cliente: cod_cliente,
      nombre_ccliente: 'CLIENTE DE PRUEBA',
      codigo_gestor: 'DQBOT',
      periodicidad_cliente: 'SEMANAL',
      pagos_cliente: 500,
      calle_dom: 'DIRECCION DE PRUEBA',
      colonia_dom: 'COLONIA PRUEBA',
      tel1_cliente: '4420000000',
      saldo_actualcli: '1000',
      dia_cobro: 'LUNES',
      semv: '50',
      semdv: '1000'
    };

    return NextResponse.json(cliente, { status: 200 });
    
  } catch (error) {
    console.error('Error buscando cliente:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}
