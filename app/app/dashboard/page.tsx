
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/navigation/header';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardStats } from '@/lib/types';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  DollarSign,
  BarChart3,
  FileText,
  Plus,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  const { data: session } = useSession() || {};
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response?.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getUserName = () => {
    return session?.user?.firstName || session?.user?.name?.split(' ')?.[0] || 'Usuario';
  };

  return (
    <div className="space-y-6 p-6">
      <Header 
        title={`${getGreeting()}, ${getUserName()}`}
        description="Resumen general de actividades del sistema"
      />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Venta
        </Button>
        <Button variant="outline">
          <CreditCard className="mr-2 h-4 w-4" />
          Registrar Pago
        </Button>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
        <Button variant="outline">
          <Package className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clientes"
          value={stats?.totalClientes || 0}
          description="Clientes registrados"
          icon={Users}
          color="blue"
          trend={{ value: 12, label: 'este mes' }}
        />
        <StatsCard
          title="Ventas del Día"
          value={`$${(stats?.ventasHoy || 0).toLocaleString()}`}
          description="Ingresos de hoy"
          icon={ShoppingCart}
          color="green"
          trend={{ value: 8, label: 'vs ayer' }}
        />
        <StatsCard
          title="Cobros del Día"
          value={`$${(stats?.cobrosHoy || 0).toLocaleString()}`}
          description="Pagos recibidos"
          icon={CreditCard}
          color="yellow"
          trend={{ value: -3, label: 'vs ayer' }}
        />
        <StatsCard
          title="Saldo Pendiente"
          value={`$${(stats?.saldoPendiente || 0).toLocaleString()}`}
          description="Por cobrar"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts and Data */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Actividad Reciente
              <Button variant="ghost" size="sm">
                Ver todo
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Pago recibido de Cliente ABC
                </p>
                <p className="text-sm text-gray-500">Hace 2 minutos</p>
              </div>
              <div className="text-sm font-medium text-green-600">
                +$1,500
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Nueva venta registrada
                </p>
                <p className="text-sm text-gray-500">Hace 15 minutos</p>
              </div>
              <div className="text-sm font-medium text-blue-600">
                $2,350
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Cliente XYZ actualizado
                </p>
                <p className="text-sm text-gray-500">Hace 1 hora</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Resumen Mensual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ventas del Mes</span>
                <span className="text-sm font-medium">${(stats?.ventasMes || 0).toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cobros del Mes</span>
                <span className="text-sm font-medium">${(stats?.cobrosMes || 0).toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clientes Activos</span>
                <span className="text-sm font-medium">{stats?.clientesActivos || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Productos en Stock</span>
                <span className="text-sm font-medium">{stats?.productosStock || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific widgets */}
      {session?.user?.role === 'GESTOR' && (
        <Card>
          <CardHeader>
            <CardTitle>Cartera de Cobranza</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">45</div>
                <div className="text-sm text-gray-500">Clientes Vencidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">23</div>
                <div className="text-sm text-gray-500">Por Vencer Hoy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-500">Al Corriente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {session?.user?.role === 'VENTAS' && (
        <Card>
          <CardHeader>
            <CardTitle>Mi Desempeño</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-500">Ventas Este Mes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$45,230</div>
                <div className="text-sm text-gray-500">Comisiones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <div className="text-sm text-gray-500">Nuevos Clientes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
