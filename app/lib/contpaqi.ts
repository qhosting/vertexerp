import { prisma } from './prisma';

export interface ContpaqiConfig {
  baseUrl: string;
  apiKey: string;
  companyId: string;
}

export interface ContpaqiInvoicePayload {
  folio?: string;
  rfcCliente: string;
  usoCfdi: string;
  regimenFiscal: string;
  metodoPago: 'PUE' | 'PPD';
  formaPago: string; // 01, 03, 99, etc.
  items: Array<{
    codigoProducto: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }>;
}

export interface ContpaqiPaymentPayload {
  folioFactura: string;
  monto: number;
  formaPago: string;
  fechaPago: string;
  referencia: string;
}

class ContpaqiService {
  private config: ContpaqiConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.CONTPAQI_API_URL || 'http://localhost:5000/api',
      apiKey: process.env.CONTPAQI_API_KEY || 'VortexContpaqiAPI2024',
      companyId: process.env.CONTPAQI_COMPANY_ID || 'DQ'
    };
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.config.apiKey,
      'X-Company-Id': this.config.companyId
    };
  }

  /**
   * Health Check: Verificar comunicación y estado de la API Contpaqi y su SDK
   */
  async healthCheck(): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/health/verificar`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          status: result.status || 'ONLINE'
        };
      } else {
        return {
          success: false,
          error: result.message || 'SDK de Contpaqi no disponible'
        };
      }
    } catch (error) {
      console.error('Contpaqi API Health Check Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión con Contpaqi API'
      };
    }
  }

  /**
   * Timbrar Factura CFDI 4.0 en Contpaqi Comercial Premium
   */
  async stampInvoice(ventaId: string, payload: ContpaqiInvoicePayload): Promise<{ success: boolean; uuid?: string; folioFactura?: string; error?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/documentos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        // Guardar la bitácora de timbrado en la base de datos de VertexERP
        await prisma.venta.update({
          where: { id: ventaId },
          data: {
            numeroFactura: result.folioFactura || payload.folio,
            observaciones: `Factura timbrada en Contpaqi. UUID: ${result.uuid || 'Pendiente'}`
          }
        });

        return {
          success: true,
          uuid: result.uuid,
          folioFactura: result.folioFactura
        };
      } else {
        return {
          success: false,
          error: result.message || 'Error del SDK Contpaqi al timbrar documento'
        };
      }
    } catch (error) {
      console.error('Contpaqi Stamping Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Fallo en la comunicación con el timbrador Contpaqi'
      };
    }
  }

  /**
   * Registrar Cliente en el padrón de Contpaqi Comercial
   */
  async syncClient(clienteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteId }
      });

      if (!cliente) return { success: false, error: 'Cliente no encontrado en Vertex' };

      const payload = {
        codigo: cliente.codigoCliente,
        nombre: cliente.nombre,
        rfc: 'XAXX010101000', // RFC genérico si no se cuenta con RFC válido en CRM
        regimenFiscal: '601', // General de Ley Personas Morales por defecto
        calle: cliente.calle || '',
        numeroExterior: cliente.numeroExterior || '',
        colonia: cliente.colonia || '',
        codigoPostal: cliente.codigoPostal || '00000'
      };

      const response = await fetch(`${this.config.baseUrl}/clientes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, error: result.message || 'Error al dar de alta cliente' };
      }
    } catch (error) {
      console.error('Contpaqi Client Sync Error:', error);
      return { success: false, error: 'Fallo al sincronizar cliente con Contpaqi' };
    }
  }

  /**
   * Sincronizar Pago (Recibo Electrónico de Pagos - REP) en Contpaqi Comercial
   */
  async syncPayment(pagoId: string, payload: ContpaqiPaymentPayload): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/pagos`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Marcar pago como verificado y sincronizado
        await prisma.pago.update({
          where: { id: pagoId },
          data: {
            verificado: true,
            sincronizado: true
          }
        });
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, error: result.message || 'Error al aplicar pago en Contpaqi' };
      }
    } catch (error) {
      console.error('Contpaqi Payment Sync Error:', error);
      return { success: false, error: 'Fallo al sincronizar pago con Contpaqi' };
    }
  }
}

export default new ContpaqiService();
