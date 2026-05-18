import { prisma } from '../prisma';

export interface Addon {
  id: string;
  name: string;
  version: string;
  description: string;
  category: 'CORE' | 'BUSINESS' | 'FINANCIAL' | 'SUPPORT' | 'AI';
  requiredRole: string[]; // Roles that can access this module
  icon: string; // Icon name from lucide
  isCore: boolean; // Cannot be disabled if true
  dependencies?: string[]; // Required addon IDs
  path: string; // Base route for the module
}

export const ADDONS_REGISTRY: Addon[] = [
  // ============= CORE ADDONS (Siempre Activos) =============
  {
    id: 'core-base',
    name: 'Núcleo Base (Core)',
    version: '1.0.0',
    description: 'Sistema base de autenticación, usuarios, roles, logs de auditoría y configuración de marca blanca.',
    category: 'CORE',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'VENTAS', 'GESTOR', 'ANALISTA'],
    icon: 'Shield',
    isCore: true,
    path: '/'
  },
  // ============= BUSINESS ADDONS (Opcionales) =============
  {
    id: 'crm-clientes',
    name: 'Gestión de Clientes (CRM)',
    version: '1.0.0',
    description: 'Expedientes de clientes, historial de crédito, referencias, avales y geolocalización satelital.',
    category: 'BUSINESS',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'VENTAS', 'GESTOR'],
    icon: 'Users',
    isCore: false,
    path: '/clientes'
  },
  {
    id: 'inventario-compras',
    name: 'Inventario y Compras (CXP)',
    version: '1.0.0',
    description: 'Control de stock, múltiples niveles de precios, almacén físico, compras a proveedores y cuentas por pagar.',
    category: 'BUSINESS',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'ANALISTA'],
    icon: 'Package',
    isCore: false,
    path: '/inventario'
  },
  {
    id: 'pedidos-ventas',
    name: 'Pedidos y Ventas',
    version: '1.0.0',
    description: 'Levantamiento de pedidos de clientes y emisión de ventas directas o financiadas.',
    category: 'BUSINESS',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'VENTAS'],
    icon: 'ShoppingCart',
    isCore: false,
    dependencies: ['crm-clientes', 'inventario-compras'],
    path: '/ventas'
  },
  // ============= FINANCIAL ADDONS =============
  {
    id: 'pagares-moratorios',
    name: 'Sistema de Pagarés e Intereses',
    version: '1.0.0',
    description: 'División automatizada de deudas en pagarés estructurados y cálculo automático diario de intereses moratorios.',
    category: 'FINANCIAL',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'ANALISTA'],
    icon: 'FileText',
    isCore: false,
    dependencies: ['pedidos-ventas'],
    path: '/pagares'
  },
  {
    id: 'cobranza-movil',
    name: 'Cobranza Móvil y Geolocalización',
    version: '1.0.0',
    description: 'Registro de abonos en campo con GPS, seguridad por IMEI del teléfono y conciliación inteligente.',
    category: 'FINANCIAL',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'GESTOR'],
    icon: 'Smartphone',
    isCore: false,
    dependencies: ['pagares-moratorios'],
    path: '/cobranza'
  },
  {
    id: 'facturacion-sat',
    name: 'Facturación SAT (CFDI 4.0)',
    version: '1.0.0',
    description: 'Emisión de facturas electrónicas, timbrado con PAC, administración de Sellos Digitales (CSD) y reportes SAT.',
    category: 'FINANCIAL',
    requiredRole: ['SUPERADMIN', 'ADMIN'],
    icon: 'Receipt',
    isCore: false,
    dependencies: ['pedidos-ventas'],
    path: '/facturacion-electronica'
  },
  {
    id: 'notas-credito-cargo',
    name: 'Notas de Cargo y Crédito',
    version: '1.0.0',
    description: 'Notas de cargo por recargos adicionales y notas de crédito para devoluciones con afectación al inventario.',
    category: 'FINANCIAL',
    requiredRole: ['SUPERADMIN', 'ADMIN'],
    icon: 'FileSpreadsheet',
    isCore: false,
    dependencies: ['pedidos-ventas'],
    path: '/notas-fiscales'
  },
  {
    id: 'reestructuras-credito',
    name: 'Reestructuras y Refinanciamiento',
    version: '1.0.0',
    description: 'Refinanciamiento de deudas, condonación de intereses moratorios y descuentos con flujo de aprobación.',
    category: 'FINANCIAL',
    requiredRole: ['SUPERADMIN', 'ADMIN'],
    icon: 'RefreshCw',
    isCore: false,
    dependencies: ['pagares-moratorios'],
    path: '/reestructuras'
  },
  // ============= SUPPORT & AI ADDONS =============
  {
    id: 'garantias-productos',
    name: 'Control de Garantías',
    version: '1.0.0',
    description: 'Gestión de fallas, diagnósticos técnicos, soporte post-venta y control de unidades de reemplazo.',
    category: 'SUPPORT',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'ANALISTA'],
    icon: 'Wrench',
    isCore: false,
    dependencies: ['inventario-compras'],
    path: '/garantias'
  },
  {
    id: 'dashboard-ai',
    name: 'Business Intelligence & AI (Abacus.AI)',
    version: '1.0.0',
    description: 'Gráficas avanzadas, analíticas de cobranza en tiempo real y predicciones inteligentes de morosidad mediante IA.',
    category: 'AI',
    requiredRole: ['SUPERADMIN', 'ADMIN', 'ANALISTA'],
    icon: 'BrainCircuit',
    isCore: false,
    dependencies: ['pagares-moratorios'],
    path: '/dashboard'
  }
];

export class AddonManager {
  /**
   * Obtiene la configuración de módulos activos desde la base de datos (o la configuración JSON)
   */
  static async getActiveAddonIds(): Promise<string[]> {
    try {
      const config = await prisma.configuracion.findFirst();
      if (config && config.configJson) {
        const configJson = config.configJson as any;
        if (configJson.activeAddons && Array.isArray(configJson.activeAddons)) {
          // Asegurar que los cores siempre estén activos
          const activeIds = new Set<string>([
            'core-base',
            ...configJson.activeAddons
          ]);
          return Array.from(activeIds);
        }
      }
    } catch (e) {
      console.error('Error cargando módulos activos:', e);
    }
    // Si no hay configuración previa, retornar todos los módulos activos por defecto
    return ADDONS_REGISTRY.map(addon => addon.id);
  }

  /**
   * Verifica si un módulo específico está activo y habilitado en el sistema
   */
  static async isAddonEnabled(addonId: string): Promise<boolean> {
    const registry = ADDONS_REGISTRY.find(a => a.id === addonId);
    if (!registry) return false;
    if (registry.isCore) return true;

    const activeIds = await this.getActiveAddonIds();
    return activeIds.includes(addonId);
  }

  /**
   * Activa o desactiva un módulo / addon en el sistema
   */
  static async toggleAddon(addonId: string, enabled: boolean): Promise<boolean> {
    const registry = ADDONS_REGISTRY.find(a => a.id === addonId);
    if (!registry || registry.isCore) return false;

    try {
      const config = await prisma.configuracion.findFirst();
      if (!config) return false;

      let configJson = (config.configJson as any) || {};
      let activeAddons: string[] = configJson.activeAddons || ADDONS_REGISTRY.filter(a => !a.isCore).map(a => a.id);

      if (enabled) {
        if (!activeAddons.includes(addonId)) {
          activeAddons.push(addonId);
        }
      } else {
        activeAddons = activeAddons.filter(id => id !== addonId);
        // Si desactivamos este módulo, también desactivamos recursivamente sus dependientes
        const dependientes = ADDONS_REGISTRY.filter(a => a.dependencies?.includes(addonId));
        for (const dep of dependientes) {
          activeAddons = activeAddons.filter(id => id !== dep.id);
        }
      }

      configJson.activeAddons = activeAddons;

      await prisma.configuracion.update({
        where: { id: config.id },
        data: { configJson }
      });

      return true;
    } catch (e) {
      console.error(`Error toggling addon ${addonId}:`, e);
      return false;
    }
  }

  /**
   * Filtra los menús de navegación en base a los módulos activos y el rol del usuario
   */
  static async getNavigationMenu(userRole: string): Promise<Addon[]> {
    const activeIds = await this.getActiveAddonIds();
    return ADDONS_REGISTRY.filter(addon => 
      activeIds.includes(addon.id) && 
      addon.requiredRole.includes(userRole)
    );
  }
}
