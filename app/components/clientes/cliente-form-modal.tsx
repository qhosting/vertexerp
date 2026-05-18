'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Phone, 
  MapPin, 
  CreditCard,
  Save,
  X,
  Building
} from 'lucide-react';

interface ClienteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId?: string; // Si se pasa, es edición, si no, es creación
  onSuccess?: () => void;
}

interface ClienteForm {
  codigoCliente: string;
  nombre: string;
  telefono1: string;
  telefono2: string;
  email: string;
  rfc: string;
  razonSocial: string;
  regimenFiscal: string;
  usoCfdi: string;
  codigoPostalFiscal: string;
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
  observaciones: string;
  gestorId: string;
  vendedorId: string;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Catálogos SAT para CFDI 4.0
const regimenesFiscales = [
  { code: '601', description: 'General de Ley Personas Morales' },
  { code: '603', description: 'Personas Morales con Fines no Lucrativos' },
  { code: '605', description: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { code: '606', description: 'Arrendamiento' },
  { code: '612', description: 'Personas Físicas con Actividades Empresariales y Profesionales' },
  { code: '616', description: 'Sin obligaciones fiscales' },
  { code: '621', description: 'Incorporación Fiscal' },
  { code: '625', description: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
  { code: '626', description: 'Régimen Simplificado de Confianza (RESICO)' },
];

const usosCfdi = [
  { code: 'G01', description: 'Adquisición de mercancías' },
  { code: 'G02', description: 'Devoluciones, descuentos o bonificaciones' },
  { code: 'G03', description: 'Gastos en general' },
  { code: 'I01', description: 'Construcciones' },
  { code: 'I02', description: 'Mobiliario y equipo de oficina por inversiones' },
  { code: 'I04', description: 'Equipo de transporte' },
  { code: 'I08', description: 'Otra maquinaria y equipo' },
  { code: 'D01', description: 'Honorarios médicos, dentales y gastos hospitalarios' },
  { code: 'D02', description: 'Gastos médicos por incapacidad o discapacidad' },
  { code: 'CP01', description: 'Pagos (Complemento de Pago)' },
  { code: 'S01', description: 'Sin efectos fiscales' },
];

const initialForm: ClienteForm = {
  codigoCliente: '',
  nombre: '',
  telefono1: '',
  telefono2: '',
  email: '',
  rfc: '',
  razonSocial: '',
  regimenFiscal: '',
  usoCfdi: '',
  codigoPostalFiscal: '',
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
  observaciones: '',
  gestorId: 'sin-gestor',
  vendedorId: 'sin-vendedor'
};

export function ClienteFormModal({ isOpen, onClose, clienteId, onSuccess }: ClienteFormModalProps) {
  const [form, setForm] = useState<ClienteForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gestores, setGestores] = useState<UserOption[]>([]);
  const [vendedores, setVendedores] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const isEdit = Boolean(clienteId);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (clienteId) {
        fetchCliente();
      } else {
        setForm({ ...initialForm, codigoCliente: generateClientCode() });
      }
    }
  }, [isOpen, clienteId]);

  const generateClientCode = () => {
    const timestamp = Date.now().toString().slice(-6);
    return `CLI-${timestamp}`;
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const users = await response.json();
        setGestores(users?.filter?.((user: UserOption) => user.role === 'GESTOR' || user.role === 'ADMIN' || user.role === 'SUPERADMIN') || []);
        setVendedores(users?.filter?.((user: UserOption) => user.role === 'VENTAS' || user.role === 'ADMIN' || user.role === 'SUPERADMIN') || []);
      } else {
        console.error('Error response:', response.status, response.statusText);
        toast.error('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/clientes/${clienteId}`);
      if (response.ok) {
        const cliente = await response.json();
        setForm({
          codigoCliente: cliente.codigoCliente || '',
          nombre: cliente.nombre || '',
          telefono1: cliente.telefono1 || '',
          telefono2: cliente.telefono2 || '',
          email: cliente.email || '',
          rfc: cliente.rfc || '',
          razonSocial: cliente.razonSocial || '',
          regimenFiscal: cliente.regimenFiscal || '',
          usoCfdi: cliente.usoCfdi || '',
          codigoPostalFiscal: cliente.codigoPostalFiscal || '',
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
          observaciones: cliente.observaciones || '',
          gestorId: cliente.gestorId || 'sin-gestor',
          vendedorId: cliente.vendedorId || 'sin-vendedor'
        });
      }
    } catch (error) {
      console.error('Error fetching cliente:', error);
      toast.error('Error al cargar los datos del cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isEdit ? `/api/clientes/${clienteId}` : '/api/clientes';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          pagosPeriodicos: parseFloat(form.pagosPeriodicos) || 0,
          gestorId: (form.gestorId && form.gestorId !== 'sin-gestor') ? form.gestorId : null,
          vendedorId: (form.vendedorId && form.vendedorId !== 'sin-vendedor') ? form.vendedorId : null,
        }),
      });

      if (response.ok) {
        toast.success(isEdit ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente');
        onSuccess?.();
        onClose();
      } else {
        const error = await response.text();
        toast.error(error || 'Error al guardar el cliente');
      }
    } catch (error) {
      console.error('Error saving cliente:', error);
      toast.error('Error al guardar el cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ClienteForm, value: string) => {
    // Si es RFC, forzar mayúsculas y limitar a 13 caracteres
    if (field === 'rfc') {
      const cleanRfc = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 13);
      setForm(prev => ({ ...prev, [field]: cleanRfc }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="direccion">Dirección</TabsTrigger>
                <TabsTrigger value="financiero">Financiero</TabsTrigger>
                <TabsTrigger value="fiscal" className="text-emerald-600 font-bold dark:text-emerald-400">Perfil Fiscal (CFDI)</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigoCliente">Código Cliente *</Label>
                    <Input
                      id="codigoCliente"
                      value={form.codigoCliente}
                      onChange={(e) => handleChange('codigoCliente', e.target.value)}
                      placeholder="CLI-123456"
                      required
                      disabled={isEdit}
                    />
                  </div>

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

                  <div className="space-y-2 md:col-span-2">
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
                    <Label htmlFor="status">Estado</Label>
                    <Select value={form.status} onValueChange={(value) => handleChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVO">Activo</SelectItem>
                        <SelectItem value="INACTIVO">Inactivo</SelectItem>
                        <SelectItem value="PROSPECTO">Prospecto</SelectItem>
                        <SelectItem value="BLOQUEADO">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gestorId">Gestor Asignado</Label>
                    <Select value={form.gestorId || "sin-gestor"} onValueChange={(value) => handleChange('gestorId', value === 'sin-gestor' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar gestor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-gestor">Sin gestor asignado</SelectItem>
                        {gestores?.map?.((gestor) => (
                          <SelectItem key={gestor.id} value={gestor.id || "sin-gestor"}>
                            {gestor.name || gestor.email || 'Sin nombre'} ({gestor.role})
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendedorId">Vendedor Asignado</Label>
                    <Select value={form.vendedorId || "sin-vendedor"} onValueChange={(value) => handleChange('vendedorId', value === 'sin-vendedor' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar vendedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-vendedor">Sin vendedor asignado</SelectItem>
                        {vendedores?.map?.((vendedor) => (
                          <SelectItem key={vendedor.id} value={vendedor.id || "sin-vendedor"}>
                            {vendedor.name || vendedor.email || 'Sin nombre'} ({vendedor.role})
                          </SelectItem>
                        )) || []}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="direccion" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calle">Calle</Label>
                    <Input
                      id="calle"
                      value={form.calle}
                      onChange={(e) => handleChange('calle', e.target.value)}
                      placeholder="Nombre de la calle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroExterior">Número Exterior</Label>
                    <Input
                      id="numeroExterior"
                      value={form.numeroExterior}
                      onChange={(e) => handleChange('numeroExterior', e.target.value)}
                      placeholder="123"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numeroInterior">Número Interior</Label>
                    <Input
                      id="numeroInterior"
                      value={form.numeroInterior}
                      onChange={(e) => handleChange('numeroInterior', e.target.value)}
                      placeholder="Apt. 4B"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colonia">Colonia</Label>
                    <Input
                      id="colonia"
                      value={form.colonia}
                      onChange={(e) => handleChange('colonia', e.target.value)}
                      placeholder="Nombre de la colonia"
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
                    <Label htmlFor="codigoPostal">Código Postal</Label>
                    <Input
                      id="codigoPostal"
                      value={form.codigoPostal}
                      onChange={(e) => handleChange('codigoPostal', e.target.value)}
                      placeholder="12345"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financiero" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Select value={form.periodicidad} onValueChange={(value) => handleChange('periodicidad', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DIARIO">Diario</SelectItem>
                        <SelectItem value="SEMANAL">Semanal</SelectItem>
                        <SelectItem value="QUINCENAL">Quincenal</SelectItem>
                        <SelectItem value="MENSUAL">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diaCobro">Día de Cobro</Label>
                    <Select value={form.diaCobro} onValueChange={(value) => handleChange('diaCobro', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LUNES">Lunes</SelectItem>
                        <SelectItem value="MARTES">Martes</SelectItem>
                        <SelectItem value="MIERCOLES">Miércoles</SelectItem>
                        <SelectItem value="JUEVES">Jueves</SelectItem>
                        <SelectItem value="VIERNES">Viernes</SelectItem>
                        <SelectItem value="SABADO">Sábado</SelectItem>
                        <SelectItem value="DOMINGO">Domingo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="observaciones">Observaciones</Label>
                    <Textarea
                      id="observaciones"
                      value={form.observaciones}
                      onChange={(e) => handleChange('observaciones', e.target.value)}
                      placeholder="Notas adicionales sobre el cliente..."
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* TABS FISCAL - CFDI 4.0 */}
              <TabsContent value="fiscal" className="space-y-4 pt-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg flex items-start gap-3">
                  <Building className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-200">Requerimientos CFDI 4.0 (México)</p>
                    <p className="text-xs text-emerald-800 dark:text-emerald-400">
                      Para emitir facturas electrónicas, el <strong>RFC</strong>, <strong>Razón Social</strong> y <strong>Código Postal Fiscal</strong> deben coincidir exactamente con la Cédula de Identificación Fiscal (CIF) del SAT del contribuyente (respetando mayúsculas, sin régimen societario como S.A. de C.V.).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rfc" className="flex items-center gap-1">
                      RFC
                    </Label>
                    <Input
                      id="rfc"
                      value={form.rfc}
                      onChange={(e) => handleChange('rfc', e.target.value)}
                      placeholder="XAXX010101000"
                      maxLength={13}
                      className="font-mono uppercase tracking-wider"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razonSocial">Razón Social (SAT)</Label>
                    <Input
                      id="razonSocial"
                      value={form.razonSocial}
                      onChange={(e) => handleChange('razonSocial', e.target.value)}
                      placeholder="NOMBRE O RAZON SOCIAL EXACTA"
                      className="uppercase"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regimenFiscal">Régimen Fiscal (SAT)</Label>
                    <Select value={form.regimenFiscal || "sin-regimen"} onValueChange={(value) => handleChange('regimenFiscal', value === 'sin-regimen' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar régimen fiscal..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-regimen">Sin régimen fiscal asignado</SelectItem>
                        {regimenesFiscales.map((reg) => (
                          <SelectItem key={reg.code} value={reg.code}>
                            {reg.code} - {reg.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usoCfdi">Uso de CFDI (SAT)</Label>
                    <Select value={form.usoCfdi || "sin-uso"} onValueChange={(value) => handleChange('usoCfdi', value === 'sin-uso' ? '' : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar uso de CFDI..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-uso">Sin uso asignado</SelectItem>
                        {usosCfdi.map((uso) => (
                          <SelectItem key={uso.code} value={uso.code}>
                            {uso.code} - {uso.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codigoPostalFiscal">Código Postal Fiscal</Label>
                    <Input
                      id="codigoPostalFiscal"
                      value={form.codigoPostalFiscal}
                      onChange={(e) => handleChange('codigoPostalFiscal', e.target.value)}
                      placeholder="Mismo de la constancia fiscal"
                      maxLength={5}
                      className="font-mono"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-6 border-t mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEdit ? 'Actualizar' : 'Crear'} Cliente
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ClienteFormModal;
