
'use client';

import { Header } from '@/components/navigation/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { showFilters, showExport, showGenerate } from '@/lib/button-handlers';

export default function ReportesPage() {
  return (
    <div className="space-y-6 p-6">
      <Header 
        title="Reportes y Análisis"
        description="Genera reportes ejecutivos y análisis de datos"
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => alert('Seleccionar período - Funcionalidad en desarrollo')}>
            <Calendar className="mr-2 h-4 w-4" />
            Período
          </Button>
          <Button variant="outline" onClick={showFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
        <Button onClick={showExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Ventas por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => showGenerate('reporte de ventas')}>
              Generar Reporte
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cobranza por Gestor</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => showGenerate('reporte de cobranza')}>
              Generar Reporte
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cartera Vencida</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => showGenerate('reporte de cartera vencida')}>
              Generar Reporte
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Centro de Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Módulo en desarrollo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Sistema de reportes dinámicos en desarrollo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
