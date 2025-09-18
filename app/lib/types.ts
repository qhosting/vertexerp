
// Definir tipos localmente para evitar problemas de importación de Prisma
export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'ANALISTA' | 'GESTOR' | 'CLIENTE' | 'VENTAS';
export type Periodicidad = 'DIARIA' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL' | 'BIMENSUAL';
export type StatusCliente = 'ACTIVO' | 'INACTIVO' | 'MOROSO' | 'BLOQUEADO' | 'PROSPECTO';
export type StatusVenta = 'PENDIENTE' | 'CONFIRMADA' | 'ENTREGADA' | 'CANCELADA' | 'PAGADA';
export type TipoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA' | 'CHEQUE' | 'OTRO';

export interface User {
  id: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  role: UserRole;
  phone?: string | null;
  sucursal?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cliente {
  id: string;
  codigoCliente: string;
  contrato?: string | null;
  nombre: string;
  telefono1?: string | null;
  telefono2?: string | null;
  telefono3?: string | null;
  email?: string | null;
  calle?: string | null;
  numeroExterior?: string | null;
  numeroInterior?: string | null;
  colonia?: string | null;
  municipio?: string | null;
  estado?: string | null;
  codigoPostal?: string | null;
  latitud?: string | null;
  longitud?: string | null;
  saldoActual: number;
  pagosPeriodicos: number;
  periodicidad: Periodicidad;
  diaCobro?: string | null;
  diaPago?: string | null;
  statusCuenta?: string | null;
  limiteCredito: number;
  empleo?: string | null;
  aval?: string | null;
  status: StatusCliente;
  gestorId?: string | null;
  vendedorId?: string | null;
  fechaAlta: Date;
  ultimaActualizacion: Date;
}

export interface Producto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  categoria?: string | null;
  marca?: string | null;
  modelo?: string | null;
  precioVenta: number;
  precioCompra?: number | null;
  margen?: number | null;
  stock: number;
  stockMinimo: number;
  unidadMedida: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Venta {
  id: string;
  numeroVenta: string;
  clienteId: string;
  vendedorId: string;
  subtotal: number;
  iva: number;
  descuento: number;
  total: number;
  anticipo: number;
  saldo: number;
  periodicidadPago: Periodicidad;
  numeroPagos: number;
  montoPago: number;
  status: StatusVenta;
  fechaVenta: Date;
  fechaVencimiento?: Date | null;
  observaciones?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pago {
  id: string;
  clienteId: string;
  ventaId?: string | null;
  gestorId?: string | null;
  referencia: string;
  monto: number;
  tipoPago: TipoPago;
  fechaPago: Date;
  fechaHora: Date;
  latitud?: string | null;
  longitud?: string | null;
  sucursal?: string | null;
  verificado: boolean;
  sincronizado: boolean;
  deviceImei?: string | null;
}

export interface DashboardStats {
  totalClientes: number;
  clientesActivos: number;
  ventasHoy: number;
  cobrosHoy: number;
  saldoPendiente: number;
  ventasMes: number;
  cobrosMes: number;
  productosStock: number;
}

export interface Permissions {
  [key: string]: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
}

export const RolePermissions: Record<UserRole, Permissions> = {
  SUPERADMIN: {
    usuarios: { read: true, write: true, delete: true },
    clientes: { read: true, write: true, delete: true },
    productos: { read: true, write: true, delete: true },
    ventas: { read: true, write: true, delete: true },
    cobranza: { read: true, write: true, delete: true },
    almacen: { read: true, write: true, delete: true },
    reportes: { read: true, write: true, delete: false },
    configuracion: { read: true, write: true, delete: false },
  },
  ADMIN: {
    usuarios: { read: true, write: true, delete: false },
    clientes: { read: true, write: true, delete: false },
    productos: { read: true, write: true, delete: false },
    ventas: { read: true, write: true, delete: false },
    cobranza: { read: true, write: true, delete: false },
    almacen: { read: true, write: true, delete: false },
    reportes: { read: true, write: true, delete: false },
    configuracion: { read: true, write: false, delete: false },
  },
  ANALISTA: {
    usuarios: { read: true, write: false, delete: false },
    clientes: { read: true, write: false, delete: false },
    productos: { read: true, write: false, delete: false },
    ventas: { read: true, write: false, delete: false },
    cobranza: { read: true, write: false, delete: false },
    almacen: { read: true, write: false, delete: false },
    reportes: { read: true, write: true, delete: false },
    configuracion: { read: true, write: false, delete: false },
  },
  GESTOR: {
    usuarios: { read: false, write: false, delete: false },
    clientes: { read: true, write: true, delete: false },
    productos: { read: true, write: false, delete: false },
    ventas: { read: true, write: false, delete: false },
    cobranza: { read: true, write: true, delete: false },
    almacen: { read: false, write: false, delete: false },
    reportes: { read: true, write: false, delete: false },
    configuracion: { read: false, write: false, delete: false },
  },
  VENTAS: {
    usuarios: { read: false, write: false, delete: false },
    clientes: { read: true, write: true, delete: false },
    productos: { read: true, write: false, delete: false },
    ventas: { read: true, write: true, delete: false },
    cobranza: { read: true, write: false, delete: false },
    almacen: { read: true, write: false, delete: false },
    reportes: { read: true, write: false, delete: false },
    configuracion: { read: false, write: false, delete: false },
  },
  CLIENTE: {
    usuarios: { read: false, write: false, delete: false },
    clientes: { read: false, write: false, delete: false },
    productos: { read: true, write: false, delete: false },
    ventas: { read: true, write: false, delete: false },
    cobranza: { read: true, write: false, delete: false },
    almacen: { read: false, write: false, delete: false },
    reportes: { read: false, write: false, delete: false },
    configuracion: { read: false, write: false, delete: false },
  },
};
