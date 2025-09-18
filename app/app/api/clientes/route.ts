
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
    const clientesEjemplo = [
      {
        cod_cliente: 'DQ2207185',
        nombre_ccliente: 'FERNANDO RIVERA RAMIREZ',
        codigo_gestor: codigoGestor,
        periodicidad_cliente: 'QUINCENAL',
        pagos_cliente: 1071,
        calle_dom: 'EL JARAL',
        exterior_dom: 'SN',
        interior_dom: '',
        colonia_dom: 'EL JARAL',
        municipio_dom: 'Corregidora',
        tel1_cliente: '4426056846',
        saldo_actualcli: '5962',
        dia_cobro: 'SABADO',
        semv: '0',
        semdv: '0',
        lat_dom: '',
        long_dom: ''
      },
      {
        cod_cliente: 'DQ2209197',
        nombre_ccliente: 'VICTORIA RAMOS MONTOYA',
        codigo_gestor: codigoGestor,
        periodicidad_cliente: 'MENSUAL',
        pagos_cliente: 1320,
        calle_dom: 'SIERRA DE LAS CRUCES',
        exterior_dom: '5',
        interior_dom: '25',
        colonia_dom: 'HDA LA CRUZ',
        municipio_dom: 'El Marqués',
        tel1_cliente: '4425554623',
        saldo_actualcli: '22381.01',
        dia_cobro: 'SABADO',
        semv: '1027',
        semdv: '22381.01',
        lat_dom: '',
        long_dom: ''
      },
      {
        cod_cliente: 'DQ2301139',
        nombre_ccliente: 'LILIA BOTELLO LOPEZ',
        codigo_gestor: codigoGestor,
        periodicidad_cliente: 'SEMANAL',
        pagos_cliente: 120,
        calle_dom: 'IGNACIO ZARAGOZA',
        exterior_dom: '45A',
        interior_dom: '',
        colonia_dom: 'CENTRO',
        municipio_dom: 'San Juan del Río',
        tel1_cliente: '7297521774',
        saldo_actualcli: '1493.01',
        dia_cobro: 'VIERNES',
        semv: '633',
        semdv: '1493.01',
        lat_dom: '',
        long_dom: ''
      }
    ];

    // Filtrar por código de gestor si es necesario
    const clientesFiltrados = clientesEjemplo.filter(
      cliente => cliente.codigo_gestor === codigoGestor
    );

    return NextResponse.json(clientesFiltrados, { status: 200 });
    
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
