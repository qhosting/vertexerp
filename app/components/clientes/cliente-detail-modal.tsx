'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar,
  DollarSign,
  Users,
  Edit,
  X,
  Building
} from 'lucide-react';

interface ClienteDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: string;
  onEdit?: (clienteId: string) => void;
}

interface ClienteDetalle {
  id: string;
  codigoCliente: string;
  nombre: string;
  telefono1?: string;
  telefono2?: string;
  email?: string;
  rfc?: string;
  razonSocial?: string;
  regimenFiscal?: string;
  usoCfdi?: string;
  codigoPostalFiscal?: string;
  municipio?: string;
  estado?: string;
  colonia?: string;
  calle?: string;
  numeroExterior?: string;
  numeroInterior?: string;
  codigoPostal?: string;
  saldoActual: number;
  pagosPeriodicos: number;
  periodicidad: string;
  status: string;
  diaCobro?: string;
  fechaAlta?: string;
  gestor?: { firstName?: string; lastName?: string; };
  vendedor?: { firstName?: string; lastName?: string; };
  // Historial de pagos reciente
  ultimosPagos?: Array<{
    fecha: string;
    monto: number;
    concepto: string;
  }>;
}

// Catálogos descripciones
const getRegimenDescription = (code?: string) => {
  if (!code) return 'No especificado';
  const data: Record<string, string> = {
    '601': 'General de Ley Personas Morales',
    '603': 'Personas Morales con Fines no Lucrativos',
    '605': 'Sueldos y Salarios',
    '606': 'Arrendamiento',
    '612': 'P.F. con Actividad Empresarial',
    '616': 'Sin obligaciones fiscales',
    '621': 'Incorporación Fiscal',
    '625': 'Actividades Primarias (AGAPES)',
    '626': 'RESICO (Simplificado de Confianza)',
  };
  return data[code] ? `${code} - ${data[code]}` : code;
};

const getUsoDescription = (code?: string) => {
  if (!code) return 'No especificado';
  const data: Record<string, string> = {
    'G01': 'Adquisición de mercancías',
    'G02': 'Devoluciones, descuentos o bonificaciones',
    'G03': 'Gastos en general',
    'I01': 'Construcciones',
    'I02': 'Mobiliario y equipo de oficina',
    'I04': 'Equipo de transporte',
    'I08': 'Otra maquinaria y equipo',
    'D01': 'Honorarios médicos',
    'D02': 'Gastos médicos por incapacidad',
    'CP01': 'Pagos (Complemento)',
    'S01': 'Sin efectos fiscales',
  };
  return data[code] ? `${code} - ${data[code]}` : code;
};

export function ClienteDetailModal({ isOpen, onClose, clienteId, onEdit }: ClienteDetailModalProps) {
  const [cliente, setCliente] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && clienteId) {
      fetchClienteDetail();
    }
  }, [isOpen, clienteId]);

  const fetchClienteDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clientes/${clienteId}`);
      if (response.ok) {
        const data = await response.json();
        setCliente(data);
      }
    } catch (error) {
      console.error('Error fetching cliente detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ACTIVO': { color: 'bg-green-100 text-green-800', text: 'Activo' },
      'INACTIVO': { color: 'bg-gray-100 text-gray-800', text: 'Inactivo' },
      'MOROSO': { color: 'bg-red-100 text-red-800', text: 'Moroso' },
      'BLOQUEADO': { color: 'bg-orange-100 text-orange-800', text: 'Bloqueado' },
      'PROSPECTO': { color: 'bg-blue-100 text-blue-800', text: 'Prospecto' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['ACTIVO'];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX');
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalles del Cliente
          </DialogTitle>
          <div className="flex gap-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(clienteId)}
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : cliente ? (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{cliente.nombre}</h2>
                <p className="text-gray-600 font-mono">Código: {cliente.codigoCliente}</p>
              </div>
              <div className="text-right">
                {getStatusBadge(cliente.status)}
                <p className="text-sm text-gray-500 mt-1">
                  Cliente desde: {formatDate(cliente.fechaAlta)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Información de Contacto */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-slate-500">Teléfono 1:</span>
                    <p className="font-semibold">{cliente.telefono1 || 'N/A'}</p>
                  </div>
                  {cliente.telefono2 && (
                    <div>
                      <span className="font-medium text-slate-500">Teléfono 2:</span>
                      <p className="font-semibold">{cliente.telefono2}</p>
                    </div>
                  )}
                  {cliente.email && (
                    <div>
                      <span className="font-medium text-slate-500">Email:</span>
                      <p className="font-semibold text-blue-600">{cliente.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dirección */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {cliente.calle && (
                    <p className="font-semibold">{cliente.calle} {cliente.numeroExterior} {cliente.numeroInterior ? `Int. ${cliente.numeroInterior}` : ''}</p>
                  )}
                  {cliente.colonia && (
                    <p className="text-slate-600">Col. {cliente.colonia}</p>
                  )}
                  <p className="text-slate-600">{cliente.municipio}, {cliente.estado}</p>
                  {cliente.codigoPostal && (
                    <p className="font-semibold font-mono">CP: {cliente.codigoPostal}</p>
                  )}
                </CardContent>
              </Card>

              {/* Información Financiera */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Financiero
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="font-medium text-slate-500">Saldo Actual:</span>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(cliente.saldoActual)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-500">Pago Periódico:</span>
                      <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(cliente.pagosPeriodicos)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                    <div>
                      <span className="font-medium text-slate-500">Periodicidad:</span>
                      <p className="font-semibold">{cliente.periodicidad}</p>
                    </div>
                    {cliente.diaCobro && (
                      <div>
                        <span className="font-medium text-slate-500">Día de Cobro:</span>
                        <p className="font-semibold">{cliente.diaCobro}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Perfil Fiscal (CFDI 4.0) */}
              <Card className="border-emerald-100 bg-emerald-50/10 dark:bg-emerald-950/5">
                <CardHeader className="pb-3 border-b border-emerald-100 dark:border-emerald-900/20">
                  <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 font-bold dark:text-emerald-400">
                    <Building className="h-4 w-4" />
                    Perfil Fiscal (CFDI 4.0)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">RFC:</span>
                      <p className="font-bold font-mono tracking-wider text-slate-800 dark:text-slate-200">
                        {cliente.rfc || 'No registrado'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">CP Fiscal:</span>
                      <p className="font-bold font-mono text-slate-800 dark:text-slate-200">
                        {cliente.codigoPostalFiscal || 'No registrado'}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-emerald-100/50">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Razón Social:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 uppercase text-xs">
                      {cliente.razonSocial || 'No registrada'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-100/50">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Régimen Fiscal:</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {getRegimenDescription(cliente.regimenFiscal)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Uso CFDI:</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {getUsoDescription(cliente.usoCfdi)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Asignaciones */}
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Personal Asignado
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-xs text-slate-400 uppercase">Gestor de Cobranza:</span>
                    <p className="font-semibold">{cliente.gestor?.firstName || 'No asignado'} {cliente.gestor?.lastName || ''}</p>
                  </div>
                  <div>
                    <span className="font-medium text-xs text-slate-400 uppercase">Vendedor:</span>
                    <p className="font-semibold">{cliente.vendedor?.firstName || 'No asignado'} {cliente.vendedor?.lastName || ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historial de Pagos Reciente */}
            {cliente.ultimosPagos && cliente.ultimosPagos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Últimos Pagos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cliente.ultimosPagos.map((pago, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{pago.concepto}</p>
                          <p className="text-sm text-gray-500">{formatDate(pago.fecha)}</p>
                        </div>
                        <div className="font-bold text-green-600">
                          {formatCurrency(pago.monto)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p>No se pudo cargar la información del cliente.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ClienteDetailModal;
