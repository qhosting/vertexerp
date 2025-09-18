
'use client';

import { Header } from '@/components/navigation/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save, Upload, Palette } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6 p-6">
      <Header 
        title="Configuración del Sistema"
        description="Personaliza la marca blanca y configuraciones generales"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Marca Blanca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Marca Blanca
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Nombre de la Empresa</Label>
              <Input id="empresa" placeholder="Tu Empresa S.A. de C.V." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo de la Empresa</Label>
              <div className="flex items-center space-x-2">
                <Input id="logo" placeholder="URL del logo" />
                <Button variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color1">Color Primario</Label>
                <Input id="color1" type="color" defaultValue="#3B82F6" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color2">Color Secundario</Label>
                <Input id="color2" type="color" defaultValue="#10B981" />
              </div>
            </div>

            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>

        {/* Información de la Empresa */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rfc">RFC</Label>
              <Input id="rfc" placeholder="RFC123456789" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" placeholder="Calle, Ciudad, Estado" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" placeholder="442-123-4567" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contacto@empresa.com" />
            </div>

            <Button className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Guardar Información
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Configuraciones del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Configuraciones Avanzadas
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Funcionalidades avanzadas de configuración en desarrollo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
