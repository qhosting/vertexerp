
'use client';

import { Header } from '@/components/navigation/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Plus, Search, Filter } from 'lucide-react';

export default function AlmacenPage() {
  return (
    <div className="space-y-6 p-6">
      <Header 
        title="Gestión de Almacén"
        description="Administra compras, inventarios y movimientos"
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Compra
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-5 w-5" />
            Control de Inventario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Módulo en desarrollo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
