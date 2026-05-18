
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import WahaAPIService from '@/lib/waha-api';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { number, message, mediaUrl, fileName } = body;

    if (!number || !message) {
      return NextResponse.json(
        { error: 'Número y mensaje son requeridos' },
        { status: 400 }
      );
    }

    // Configuración de WAHA API (en producción usar variables de entorno)
    const wahaConfig = {
      baseUrl: process.env.WAHA_API_URL || 'http://localhost:3000',
      sessionName: process.env.WAHA_SESSION_NAME || 'default',
      token: process.env.WAHA_API_TOKEN || '',
    };

    const wahaService = new WahaAPIService(wahaConfig);

    let result;
    if (mediaUrl) {
      result = await wahaService.sendMedia({
        number,
        message,
        mediaUrl,
        fileName,
      });
    } else {
      result = await wahaService.sendMessage({
        number,
        message,
      });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'WhatsApp enviado exitosamente vía WAHA',
      });
    } else {
      return NextResponse.json(
        { 
          error: result.error || 'Error al enviar WhatsApp vía WAHA',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('WhatsApp WAHA API Error:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}
