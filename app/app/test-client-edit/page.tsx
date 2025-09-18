
'use client';

import { TestClientForm } from '@/components/test/test-client-form';

export default function TestClientEditPage() {
  // ID real de uno de los clientes de la base de datos
  const clienteId = "cmfozl9ij0009t56gqtsoefae"; // Cliente Juan Pérez García

  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold">Prueba de Edición de Cliente</h1>
      
      <div className="mt-8 p-4 bg-gray-100 rounded mb-6">
        <h3 className="font-semibold">Cliente de Prueba:</h3>
        <p><strong>ID:</strong> {clienteId}</p>
        <p><strong>Nombre:</strong> Juan Pérez García</p>
        <p><strong>Código:</strong> CLI001</p>
        <p><strong>Teléfono:</strong> 442-555-0001</p>
      </div>

      <TestClientForm clienteId={clienteId} />
    </div>
  );
}
