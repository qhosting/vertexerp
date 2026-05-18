export interface WahaMessage {
  number: string; // E.g., '5211234567890'
  message: string;
  mediaUrl?: string;
  fileName?: string;
}

export interface WahaConfig {
  baseUrl: string;
  token?: string; // Optional if WAHA requires API Key authorization
  sessionName?: string; // Default: 'default'
}

class WahaAPIService {
  private config: WahaConfig;

  constructor(config: WahaConfig) {
    this.config = {
      sessionName: 'default',
      ...config
    };
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.config.token) {
      headers['Authorization'] = `Bearer ${this.config.token}`;
    }
    return headers;
  }

  /**
   * Format phone number to standard JID format required by WAHA
   */
  private formatJid(number: string): string {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.endsWith('@c.us') || cleanNumber.endsWith('@s.whatsapp.net')) {
      return cleanNumber;
    }
    return `${cleanNumber}@c.us`;
  }

  /**
   * Send text message via WAHA API
   */
  async sendMessage(data: WahaMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const payload = {
        chatId: this.formatJid(data.number),
        text: data.message,
        session: this.config.sessionName
      };

      const response = await fetch(`${this.config.baseUrl}/api/sendText`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.id || 'waha-msg-ok',
        };
      } else {
        return {
          success: false,
          error: result.message || 'Error al enviar texto en WAHA',
        };
      }
    } catch (error) {
      console.error('WAHA API SendMessage Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en WAHA',
      };
    }
  }

  /**
   * Send files (images, PDFs, invoices) via WAHA API
   */
  async sendMedia(data: WahaMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!data.mediaUrl) {
        return this.sendMessage(data);
      }

      const payload = {
        chatId: this.formatJid(data.number),
        file: {
          url: data.mediaUrl,
          name: data.fileName || 'archivo'
        },
        caption: data.message,
        session: this.config.sessionName
      };

      const response = await fetch(`${this.config.baseUrl}/api/sendFile`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.id || 'waha-media-ok',
        };
      } else {
        return {
          success: false,
          error: result.message || 'Error al enviar archivo en WAHA',
        };
      }
    } catch (error) {
      console.error('WAHA API SendMedia Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido en WAHA',
      };
    }
  }

  /**
   * Verify session status in WAHA (QR code, connected, disconnected)
   */
  async getSessionStatus(): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/${this.config.sessionName}/status`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          status: result.status || 'unknown',
        };
      } else {
        return {
          success: false,
          error: result.message || 'Error al verificar sesión en WAHA',
        };
      }
    } catch (error) {
      console.error('WAHA API SessionStatus Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión con servidor WAHA',
      };
    }
  }
}

export default WahaAPIService;
