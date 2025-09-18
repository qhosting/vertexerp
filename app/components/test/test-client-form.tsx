
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

interface TestClientFormProps {
  clienteId: string;
}

interface ClienteForm {
  nombre: string;
  telefono1: string;
  telefono2: string;
  email: string;
  municipio: string;
  estado: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  pagosPeriodicos: string;
  periodicidad: string;
  status: string;
  diaCobro: string;
}

const initialForm: ClienteForm = {
  nombre: '',
  telefono1: '',
  telefono2: '',
  email: '',
  municipio: '',
  estado: '',
  colonia: '',
  calle: '',
  numeroExterior: '',
  numeroInterior: '',
  codigoPostal: '',
  pagosPeriodicos: '0',
  periodicidad: 'SEMANAL',
  status: 'ACTIVO',
  diaCobro: 'LUNES',
};

export function TestClientForm({ clienteId }: TestClientFormProps) {
  const [form, setForm] = useState<ClienteForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCliente();
  }, [clienteId]);

  const fetchCliente = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching cliente:', clienteId);
      const response = await fetch(`/api/test-client/${clienteId}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const cliente = await response.json();
        console.log('Cliente data:', cliente);
        
        setForm({
          nombre: cliente.nombre || '',
          telefono1: cliente.telefono1 || '',
          telefono2: cliente.telefono2 || '',
          email: cliente.email || '',
          municipio: cliente.municipio || '',
          estado: cliente.estado || '',
          colonia: cliente.colonia || '',
          calle: cliente.calle || '',
          numeroExterior: cliente.numeroExterior || '',
          numeroInterior: cliente.numeroInterior || '',
          codigoPostal: cliente.codigoPostal || '',
          pagosPeriodicos: cliente.pagosPeriodicos?.toString() || '0',
          periodicidad: cliente.periodicidad || 'SEMANAL',
          status: cliente.status || 'ACTIVO',
          diaCobro: cliente.diaCobro || 'LUNES',
        });
        toast.success('Cliente cargado exitosamente');
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setError(`Error al cargar cliente: ${response.status}`);
        toast.error('Error al cargar los datos del cliente');
      }
    } catch (error) {
      console.error('Error fetching cliente:', error);
      setError(`Error de conexión: ${error}`);
      toast.error('Error al cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      console.log('Sending update data:', form);
      const response = await fetch(`/api/test-client/${clienteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          pagosPeriodicos: parseFloat(form.pagosPeriodicos) || 0,
        }),
      });

      console.log('Update response status:', response.status);
      const responseData = await response.json();
      console.log('Update response data:', responseData);

      if (response.ok) {
        toast.success('Cliente actualizado exitosamente');
      } else {
        console.error('Update error:', responseData);
        setError(`Error al actualizar: ${responseData.error || response.status}`);
        toast.error(responseData.error || 'Error al guardar el cliente');
      }
    } catch (error) {
      console.error('Error saving cliente:', error);
      setError(`Error de conexión al guardar: ${error}`);
      toast.error('Error al guardar el cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ClienteForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Prueba de Edición de Cliente</CardTitle>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando datos del cliente...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Nombre completo del cliente"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono1">Teléfono Principal *</Label>
                <Input
                  id="telefono1"
                  value={form.telefono1}
                  onChange={(e) => handleChange('telefono1', e.target.value)}
                  placeholder="555-123-4567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono2">Teléfono Secundario</Label>
                <Input
                  id="telefono2"
                  value={form.telefono2}
                  onChange={(e) => handleChange('telefono2', e.target.value)}
                  placeholder="555-123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="cliente@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipio">Municipio</Label>
                <Input
                  id="municipio"
                  value={form.municipio}
                  onChange={(e) => handleChange('municipio', e.target.value)}
                  placeholder="Nombre del municipio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={form.estado}
                  onChange={(e) => handleChange('estado', e.target.value)}
                  placeholder="Nombre del estado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pagosPeriodicos">Pago Periódico *</Label>
                <Input
                  id="pagosPeriodicos"
                  type="number"
                  step="0.01"
                  value={form.pagosPeriodicos}
                  onChange={(e) => handleChange('pagosPeriodicos', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodicidad">Periodicidad</Label>
                <select 
                  id="periodicidad"
                  value={form.periodicidad} 
                  onChange={(e) => handleChange('periodicidad', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="DIARIO">Diario</option>
                  <option value="SEMANAL">Semanal</option>
                  <option value="QUINCENAL">Quincenal</option>
                  <option value="MENSUAL">Mensual</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="submit" disabled={saving || loading}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Cliente'
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
