import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AddonManager, ADDONS_REGISTRY } from '@/lib/addons/addon-manager';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const activeAddons = await AddonManager.getActiveAddonIds();
    
    // Mapear addons con su estado de activación
    const addons = ADDONS_REGISTRY.map(addon => ({
      ...addon,
      isActive: activeAddons.includes(addon.id)
    }));

    return NextResponse.json({ addons, activeIds: activeAddons });
  } catch (error) {
    console.error('Error al obtener addons:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'SUPERADMIN' && session.user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { addonId, enabled } = await request.json();
    
    if (!addonId) {
      return NextResponse.json({ error: 'Falta el ID del módulo' }, { status: 400 });
    }

    const success = await AddonManager.toggleAddon(addonId, enabled);
    if (success) {
      const activeAddons = await AddonManager.getActiveAddonIds();
      return NextResponse.json({ success: true, activeIds: activeAddons });
    } else {
      return NextResponse.json({ error: 'Error al cambiar estado del módulo o es un módulo CORE' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error al actualizar addon:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
