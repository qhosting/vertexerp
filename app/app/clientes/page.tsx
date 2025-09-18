
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/navigation/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RolePermissions } from '@/lib/types';
import { 
  Plus, 
  Search, 
  Users, 
  Phone, 
  MapPin,
  CreditCard,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface Cliente {
  id: string;
  codigoCliente: string;
  nombre: string;
  telefono1?: string;
  municipio?: string;
  estado?: string;
  saldoActual: number;
  pagosPeriodicos: number;
  periodicidad: string;
  status: string;
  diaCobro?: string;
  gestor?: { firstName?: string; lastName?: string; };
  vendedor?: { firstName?: string; lastName?: string; };
}

export default function ClientesPage() {
  const { data: session } = useSession() || {};
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewClienteDialog, setShowNewClienteDialog] = useState(false);

  const userRole = session?.user?.role;
  const permissions = userRole ? RolePermissions[userRole] : null;
  const canWrite = permissions?.clientes?.write === true;
  const canDelete = permissions?.clientes?.delete === true;

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clientes?.filter?.(cliente =>
        cliente?.nombre?.toLowerCase()?.includes?.(searchTerm?.toLowerCase()) ||
        cliente?.codigoCliente?.toLowerCase()?.includes?.(searchTerm?.toLowerCase()) ||
        cliente?.telefono1?.includes?.(searchTerm) ||
        cliente?.municipio?.toLowerCase()?.includes?.(searchTerm?.toLowerCase())
      ) || [];
      setFilteredClientes(filtered);
    } else {
      setFilteredClientes(clientes);
    }
  }, [searchTerm, clientes]);

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes');
      if (response?.ok) {
        const data = await response.json();
        setClientes(data || []);
      }
    } catch (error) {
      console.error('Error fetching clientes:', error);
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
    
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleNewCliente = () => {
    setShowNewClienteDialog(true);
  };

  const handleImportClientes = () => {
    // TODO: Implementar funcionalidad de importar
    alert('Función de importar clientes en desarrollo');
  };

  const handleViewCliente = (clienteId: string) => {
    // TODO: Implementar vista detallada del cliente
    alert(`Ver detalles del cliente: ${clienteId}`);
  };

  const handleEditCliente = (clienteId: string) => {
    // TODO: Implementar edición del cliente
    alert(`Editar cliente: ${clienteId}`);
  };

  const handleDeleteCliente = (clienteId: string) => {
    // TODO: Implementar confirmación y eliminación
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      alert(`Eliminar cliente: ${clienteId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Header 
        title="Gestión de Clientes"
        description="Administra la información de tus clientes y su cartera"
      />

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline" onClick={handleShowFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {canWrite && (
            <Button onClick={handleNewCliente}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          )}
          <Button variant="outline" onClick={handleImportClientes}>
            <Users className="mr-2 h-4 w-4" />
            Importar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Clientes registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {clientes?.filter?.(c => c?.status === 'ACTIVO')?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Morosos</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {clientes?.filter?.(c => c?.status === 'MOROSO')?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren seguimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cartera Total</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(
                clientes?.reduce?.((sum, c) => sum + (c?.saldoActual || 0), 0) || 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Saldo por cobrar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClientes?.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay clientes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No se encontraron clientes con ese criterio de búsqueda.' : 'Comienza agregando un nuevo cliente.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Contacto</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Ubicación</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Saldo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Pago</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Asignado</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes?.map?.((cliente) => (
                    <tr key={cliente?.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{cliente?.nombre}</div>
                          <div className="text-sm text-gray-500">{cliente?.codigoCliente}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="mr-2 h-4 w-4 text-gray-400" />
                          {cliente?.telefono1 || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                          {cliente?.municipio ? `${cliente.municipio}, ${cliente?.estado}` : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(cliente?.saldoActual)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(cliente?.pagosPeriodicos)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {cliente?.periodicidad} - {cliente?.diaCobro}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(cliente?.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-900">
                          Gestor: {cliente?.gestor?.firstName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ventas: {cliente?.vendedor?.firstName || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCliente(cliente?.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canWrite && (
                            <Button variant="ghost" size="sm" onClick={() => handleEditCliente(cliente?.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCliente(cliente?.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => alert('Más opciones disponibles próximamente')}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
